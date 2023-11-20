import type {
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

export const s3 = new S3Client({ region: process.env.AWS_REGION })

export const s3upload = function (params: PutObjectCommandInput) {
  const command = new PutObjectCommand(params)
  return s3.send(command)
}
export const s3download = function (params: GetObjectCommandInput) {
  const command = new GetObjectCommand(params)
  return s3.send(command)
}
