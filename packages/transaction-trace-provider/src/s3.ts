import type { CompletedPart } from '@aws-sdk/client-s3'
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
})

export const getFilePath = (txHash: string, chainId: string) => {
  const fileName = `trace/${chainId}/${txHash}.json`
  return `${process.env.ANALYZER_DATA_BUCKET_NAME}/${fileName}`
}

export const pushTraceToS3 = async (txHash: string, chainId: string, json: string) => {
  console.log('process.env.ANALYZER_DATA_BUCKET_NAME', process.env.ANALYZER_DATA_BUCKET_NAME)
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

export const createMultiPartUpload = async (txHash: string, chainId: string) => {
  const fileName = `trace/${chainId}/${txHash}.json`
  const params = {
    Key: fileName,
    ContentType: 'application/json',
    Bucket: process.env.ANALYZER_DATA_BUCKET_NAME,
  }
  const command = new CreateMultipartUploadCommand(params)
  const response = await s3Client.send(command)
  return response.UploadId
}

export const uploadPart = async (txHash: string, chainId: string, uploadId: string, partNumber: number, body: string) => {
  const fileName = `trace/${chainId}/${txHash}.json`
  const params = {
    UploadId: uploadId,
    PartNumber: partNumber,
    Key: fileName,
    Bucket: process.env.ANALYZER_DATA_BUCKET_NAME,
    Body: body,
  }
  const command = new UploadPartCommand(params)
  const response = await s3Client.send(command)
  return response.ETag
}

export const completeMultiPartUpload = async (txHash: string, chainId: string, uploadId: string, parts: CompletedPart[]) => {
  const fileName = `trace/${chainId}/${txHash}.json`
  const params = {
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
    Key: fileName,
    Bucket: process.env.ANALYZER_DATA_BUCKET_NAME,
  }
  const command = new CompleteMultipartUploadCommand(params)
  await s3Client.send(command)
}

export const abortMultiPartUpload = async (txHash: string, chainId: string, uploadId: string) => {
  const fileName = `trace/${chainId}/${txHash}.json`
  const params = {
    UploadId: uploadId,
    Key: fileName,
    Bucket: process.env.ANALYZER_DATA_BUCKET_NAME,
  }
  const command = new AbortMultipartUploadCommand(params)
  await s3Client.send(command)
}
