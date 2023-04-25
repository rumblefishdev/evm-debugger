import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
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
  const filePath = `${process.env.ANALYZER_DATA_BUCKET_NAME}/${fileName}`
  console.log(`Pushing ${fileName} to ${filePath}`)
  const command = new PutObjectCommand(params)
  await s3Client.send(command)
  return filePath
}
