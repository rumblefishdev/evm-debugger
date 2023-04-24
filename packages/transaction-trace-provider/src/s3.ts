import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const REGION = 'us-east-1'

const s3Client = new S3Client({
  region: REGION,
})

export const pushTraceToS3 = async (
  txHash: string,
  chainId: string,
  json: string,
) => {
  const fileName = `trace/${chainId}/${txHash}.json`
  const params = {
    Key: fileName,
    ContentType: 'application/json',
    Bucket: process.env.ANALYZER_DATA_BUCKET_NAME,
    Body: json,
  }
  console.log(`Pushing ${fileName} to ${process.env.ANALYZER_DATA_BUCKET_NAME}`)
  const command = new PutObjectCommand(params)
  await s3Client.send(command)
  return fileName
}
