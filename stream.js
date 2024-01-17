import * as Minio from 'minio'
import express from 'express'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

// Configure MinIO client
const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'WgyYGZBNDuluJypxYBYz',
    secretKey: 'kqPAHuKZIlmgNOGj7UptuCvhP082QGzDUTcLnwrM',
});

app.get('/video/:filename', async (req, res) => {

    try {
        const range = req.headers.range;
        if (!range) {
            res.status(400).send("Requires Range header");
            return;
        }

        // Your MinIO bucket and video file details
        const bucketName = 'js-test-bucket-2';
        const videoKey = req.params.filename;

        // Define a function to get video size from MinIO
        const stat = await minioClient.statObject(bucketName, videoKey);
        const videoSize = stat.size;
        
        const chunkSize = (videoSize / 92500) * 1e6; // 1 * 1e6 1MB; 92500 is a magic number
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + chunkSize, videoSize - 1);
        const contentLength = end - start + 1;

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        };

        // Stream video from MinIO
        const stream = await minioClient.getPartialObject(bucketName, videoKey, start, end);
        res.writeHead(206, headers);
        stream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error streaming video");
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
