import 'dotenv/config'
import express from 'express';
import fs from 'fs';
import fetch from 'node-fetch';
import util from 'util';

const PORT = process.env.PORT || 3001;
const app = express();


const downloadFile = (async (url, path, response, title) => {
    
    await fetch(url).then(res => new Promise((resolve, reject) => {
        
        console.log("fetch executied");
    
        const dest = fs.createWriteStream(path);
        res.body.pipe(dest);
        dest.on('finish', () => resolve());
        dest.on('error', reject);

    })).then(async () => { 
            
        console.log("into 2nd part");

        let file = fs.createReadStream(path);
        response.attachment(title + '.mp3');

        await new Promise((resolve, reject) => {
            
            console.log("into 2nd promise");

            file.pipe(response);
            file.on("error", reject);
            file.on("finsh", resolve);

            

        }).then(x => console.log("code complete"));

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

    downloadFile(url,'/tmp/download.mp3',res, title)

    

});

app.get("/api", (req, res) => {
    console.log(`GET TEST`);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});