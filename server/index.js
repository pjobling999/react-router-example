import 'dotenv/config'
import express from 'express';
import fs from 'fs';
import fetch from 'node-fetch';

const PORT = process.env.PORT || 3001;
const app = express();

app.get("/api/:id/:title", (req, res) => {

    var id = req.params.id;
    var title = req.params.title;
    var key = process.env.GOOGLE_API_KEY;

    fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`).then(res2 => new Promise((resolve, reject) => {
        const dest = fs.createWriteStream('./tmp/download.mp3');
        res2.body.pipe(dest);
        dest.on('close', () => resolve(dest));
        dest.on('error', reject);
    })).then(x => { 
            
            res.attachment(title + '.mp3');
            var readStream = fs.createReadStream('./tmp/download.mp3');
            readStream.pipe(res);
        });


});

app.get('/', (req, res) => {
    res.send('TEST!');
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});