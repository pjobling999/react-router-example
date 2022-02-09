import 'dotenv/config'
import express from 'express';
import fs from 'fs';
import fetch from 'node-fetch';
import util from 'util';

const PORT = process.env.PORT || 3001;
const app = express();


const downloadFile = (async (url, path, response, title) => {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
      }).catch(function(error) {

        console.log("ERROR GETTING DRIVE FILE:" + error);
        throw new Error(error);
        
      }).then(async () => { 
            
        let file = fs.createReadStream(path);
        response.attachment(title + '.mp3');

        await new Promise((resolve, reject) => {
            
            file.pipe(response);
            file.on("error", reject);
            file.on("finish", resolve);
            
        }).catch(function(error) {

            console.log("ERROR SENDING FILE:" + error);
            throw new Error(error);

          });
            
            
                
    });
    
  });


app.get("/api/:id/:title", (req, res) => {

    var id = req.params.id;
    var title = req.params.title;
    var key = process.env.GOOGLE_API_KEY;
    var url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`;

    console.log(url);
    
    // fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`).then(res2 => new Promise((resolve, reject) => {
    //     const dest = fs.createWriteStream('/tmp/download.mp3');
    //     res2.body.pipe(dest);
    //     dest.on('close', () => resolve(dest));
    //     dest.on('error', rejected);
    // })).then(x => { 
            
    //         res.attachment(title + '.mp3');
    //         var readStream = fs.createReadStream('/tmp/download.mp3');
    //         readStream.pipe(res);
    //     });

    downloadFile(`https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`,'tmp/download.mp3',res, title)

    

});

app.get("/api", (req, res) => {
    console.log(`GET TEST`);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});