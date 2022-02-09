import 'dotenv/config'
import express from 'express';
import fs from 'fs';
import fetch from 'node-fetch';
import util from 'util';

const PORT = process.env.PORT || 3001;
const app = express();


const downloadFile = (async (url, path) => {
    
    const res = await fetch(url);
    const dest = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
       
        res.body.pipe(dest);
        res.body.on("error", reject);
        dest.on('finish', resolve);

    });

  });


app.get("/api/:id/:title", async (req, res) => {

    var id = req.params.id;
    var title = req.params.title;
    var key = process.env.GOOGLE_API_KEY;
    var url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`;
    var path = '/tmp/download.mp3';

    console.log(url);
    
    await downloadFile(url, path);

    console.log('About to download');

    console.log(fs.statSync(path).size);
    
    res.download(path, title + '.mp3');
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});