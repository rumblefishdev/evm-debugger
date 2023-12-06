import type {
  AbortMultipartUploadCommandInput,
  CompleteMultipartUploadCommandInput,
  CompletedPart,
  CreateMultipartUploadCommandInput,
  UploadPartCommandInput,
} from '@aws-sdk/client-s3'
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
  const params: CreateMultipartUploadCommandInput = {
    Key: fileName,
    Expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    ContentType: 'application/json',
    Bucket: process.env.ANALYZER_DATA_BUCKET_NAME,
  }
  const command = new CreateMultipartUploadCommand(params)
  let s3Response

  try {
    s3Response = await s3Client.send(command)
  } catch (error) {
    console.log('CreateMultipartUploadCommand Error:', error)
    throw error
  }

  const uploadId = s3Response?.UploadId

  if (!uploadId) throw new Error('Failed to create multi part upload')

  return uploadId
}

export const uploadPart = async (txHash: string, chainId: string, uploadId: string, partNumber: number, body: string | Buffer) => {
  const fileName = getFileName(txHash, chainId)
  const params: UploadPartCommandInput = {
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
  const params: CompleteMultipartUploadCommandInput = {
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
  const params: AbortMultipartUploadCommandInput = {
    UploadId: uploadId,
    Key: fileName,
    Bucket: process.env.ANALYZER_DATA_BUCKET_NAME,
  }
  const command = new AbortMultipartUploadCommand(params)
  await s3Client.send(command)
}
