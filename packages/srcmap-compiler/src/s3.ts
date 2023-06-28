import type {
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const { BUCKET_NAME, AWS_REGION } = process.env

const s3 = new S3Client({
  region: AWS_REGION,
})

export const s3upload = function (params: PutObjectCommandInput) {
  const command = new PutObjectCommand(params)
  return s3.send(command)
}

export const s3download = function (params: GetObjectCommandInput) {
  const command = new GetObjectCommand(params)
  return s3.send(command)
}
