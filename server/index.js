import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import fetch from 'node-fetch';
import * as storage from '@google-cloud/storage';
import * as id3 from 'node-id3';
import bodyParser from 'body-parser';

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

const downloadFile = (async (url, path, title, tags) => {
    
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
        // const tags = {
        //   title: `${title}`,
        //   artist: `DJ JOBBO`,
        //   album: `SLAMMING BEATS`
        // };
        const success = id3.write(tags, path);
        console.log(`set id3 tags - ${success} `);
         
        await uploadFile('jobbo-tunez.appspot.com',path, `${title}.mp3`).catch(console.error);
        console.log('uploaded to bucket');
        await makePublic('jobbo-tunez.appspot.com',`${title}.mp3`).catch(console.error);
        console.log('made public');
        
    });

  });

// create application/json parser
var jsonParser = bodyParser.json()
  
app.post("/api/:id/:title", jsonParser, async (req, res) => {

    var id = req.params.id;
    var title = req.params.title;
    var key = process.env.GOOGLE_API_KEY;
    var url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`;
    var path = `/tmp/${title}.mp3`;
    var tags = req.body.tags;

    console.log(url);
    console.log(req.body.tags);
    
    await downloadFile(url, path, title, tags);
    console.log('downloaded');
    res.send(`https://storage.googleapis.com/jobbo-tunez.appspot.com/${title}.mp3`);
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});