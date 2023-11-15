import type { CompletedPart } from '@aws-sdk/client-s3'
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
})

export const getFileName = (txHash: string, chainId: string) => {
  return `trace/${chainId}/${txHash}.json`
}

export const getFilePath = (txHash: string, chainId: string) => {
  const fileName = getFileName(txHash, chainId)
  return `${process.env.ANALYZER_DATA_BUCKET_NAME}/${fileName}`
}

export const createMultiPartUpload = async (txHash: string, chainId: string) => {
  const fileName = getFileName(txHash, chainId)
  const params = {
    Key: fileName,
    ContentType: 'application/json',
    Bucket: process.env.ANALYZER_DATA_BUCKET_NAME,
  }
  const command = new CreateMultipartUploadCommand(params)
  const response = await s3Client.send(command)

  const uploadId = response.UploadId

  if (!uploadId) throw new Error('Failed to create multi part upload')

  return uploadId
}

export const uploadPart = async (txHash: string, chainId: string, uploadId: string, partNumber: number, body: string) => {
  const fileName = getFileName(txHash, chainId)
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
  const fileName = getFileName(txHash, chainId)
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
  const fileName = getFileName(txHash, chainId)
  const params = {
    UploadId: uploadId,
    Key: fileName,
    Bucket: process.env.ANALYZER_DATA_BUCKET_NAME,
  }
  const command = new AbortMultipartUploadCommand(params)
  await s3Client.send(command)
}
