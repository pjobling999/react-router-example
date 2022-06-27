import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import fetch from 'node-fetch';
import * as storage from '@google-cloud/storage';
import * as id3 from 'node-id3';
import * as ffmetadata from 'ffmetadata';

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors())
const client = new storage.Storage();
//const client = new storage.Storage({keyFilename: 'server/jobbo-tunez-7079f27f0f61.json'});

async function uploadFile(bucketName, filePath, destFileName ) {

  await client.bucket(bucketName).upload(filePath, {
    destination: destFileName,
  });

  console.log(`${filePath} uploaded to ${bucketName}`);
}

async function makePublic(bucketName, fileName ) {
  await client.bucket(bucketName).file(fileName).makePublic();

  console.log(`gs://${bucketName}/${fileName} is now public.`);
}

const downloadFile = (async (url, path, title) => {
    
    const res = await fetch(url);
    console.log('fetch done');
    const dest = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
       
        res.body.pipe(dest);
        console.log('pipe done');
        res.body.on("error", reject);
        dest.on('finish', resolve);

    }).then(async x => {

        console.log('got file');

        //put mp3 tagging here with NodeID3
        const tags = {
          title: "Tomorrow",
          artist: "Kevin Penkin",
          album: "TEST"
        };
        // const success1 = id3.removeTags(path)  
        const success = id3.write(tags, path);
        console.log(`set id3 tags - ${success} `);
        // ffmetadata.setFfmpegPath(path);
        // ffmetadata.write(path, tags, function(err) {
        //   if (err) 
          
        //     console.error("Error writing metadata", err);
          
        //   else 
          
        //     console.log("Data written");
        //  });

        await uploadFile('jobbo-tunez.appspot.com',path, `${title}.mp3`).catch(console.error);
        console.log('uploaded to bucket');
        await makePublic('jobbo-tunez.appspot.com',`${title}.mp3`).catch(console.error);
        console.log('made public');
        
    });

  });


app.get("/api/:id/:title", async (req, res) => {

    var id = req.params.id;
    var title = req.params.title;
    var key = process.env.GOOGLE_API_KEY;
    var url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`;
    var path = `/tmp/${title}.mp3`;
    //var path = `tmp/${title}.mp3`;

    console.log(url);
    
    await downloadFile(url, path, title);
    console.log('downloaded');
    res.send(`https://storage.googleapis.com/jobbo-tunez.appspot.com/${title}.mp3`);
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});