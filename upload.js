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

// Check if the bucket exists
// If it doesn't, create it
const exists = await minioClient.bucketExists(bucket)
if (exists) {
  console.log('Bucket ' + bucket + ' exists.')
} else {
  await minioClient.makeBucket(bucket, 'us-east-1')
  console.log('Bucket ' + bucket + ' created in "us-east-1".')
}

// Set the object metadata
var metaData = {
  'Content-Type': 'video/mp4'
}

// Upload the file with fPutObject
// If an object with the same name exists,
// it is updated with new data
await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)
console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket)