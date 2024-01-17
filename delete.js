import * as Minio from 'minio'

// Instantiate the MinIO client with the object store service
// endpoint and an authorized user's credentials
// play.min.io is the MinIO public test cluster
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'WgyYGZBNDuluJypxYBYz',
  secretKey: 'kqPAHuKZIlmgNOGj7UptuCvhP082QGzDUTcLnwrM',
})

// File to upload
const sourceFile = './tmp/big-video.mp4'

// Destination bucket
const bucket = 'js-test-bucket'

// Destination object name
const destinationObject = 'big-video.mp4'

// Set the object metadata
var metaData = {
  'Content-Type': 'video/mp4'
}

// delete an object
await minioClient.removeObject(bucket, destinationObject)
console.log('File ' + sourceFile + ' has been deleted. object ' + destinationObject + ' in bucket ' + bucket)