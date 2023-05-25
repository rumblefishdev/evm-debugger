/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch'
import type {
  PutObjectRequest,
  PutObjectCommandInput,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import type { ChainId } from '@evm-debuger/types'
import {
  etherscanUrls,
  TransactionTraceResponseStatus,
} from '@evm-debuger/types'

const { BUCKET_NAME, AWS_REGION } = process.env

const s3 = new S3Client({
  region: AWS_REGION,
})

const defaultStatus = {
  status: TransactionTraceResponseStatus.PENDING,
}

const s3upload = function (params: PutObjectCommandInput) {
  const command = new PutObjectCommand(params)
  return s3.send(command)
}

const s3download = function (params: GetObjectCommandInput) {
  const command = new GetObjectCommand(params)
  return s3.send(command)
}

const parseFiles = async (file: string, params: PutObjectRequest) => {
  const regexPattern = /^[^\r\\]*/
  const parsed = {
    filename: regexPattern.test(file) ? file.match(regexPattern)[0] : null,
    body: `// File: ${file}`,
  }
  if (parsed.filename) {
    const key = params.Key?.replace(
      'payload.json',
      `contract_files/${parsed.filename}`,
    )
    await s3upload({
      Key: key,
      Bucket: params.Bucket,
      Body: parsed.body,
    })
    return key
  }
  return null
}

const extractFiles = async (files: string, params: PutObjectRequest) => {
  let uploaded: (string | null | undefined)[] = []
  if (files && files.length > 0) {
    const splited = files.split('// File: ')

    uploaded = await Promise.all(
      splited.map((file) => parseFiles(file, params)),
    )
    console.log({
      uploaded: uploaded.filter(Boolean),
      params,
    })
  }
  return uploaded.filter(Boolean)
}

export type Address = {
  address: string
  chainId: ChainId
}

export const getObject = async function (params: GetObjectCommandInput) {
  try {
    const command = new GetObjectCommand(params)
    const data: any = await s3.send(command)
    // eslint-disable-next-line unicorn/text-encoding-identifier-case
    return data.Body.toString('utf-8')
  } catch {
    return null
  }
}

export const constructFiles = async (
  address: Address,
  params: PutObjectRequest,
) => {
  const scanUrl = `${
    etherscanUrls[address.chainId].url
  }/api?module=contract&action=getsourcecode&address=${
    address.address
  }&apikey=${etherscanUrls[address.chainId].key}`
  let body: any = defaultStatus
  await s3upload({
    ...params,
    Body: JSON.stringify(body),
  })

  const ethResponse = await fetch(scanUrl)
  const data: any = await ethResponse.json()
  if (data.status === '1' && data.message === 'OK') {
    const content = data.result[0]
    try {
      body = {
        SwarmSource: content.SwarmSource,
        status: TransactionTraceResponseStatus.PENDING,
        Runs: content.Runs,
        Proxy: content.Proxy,
        OptimizationUsed: content.OptimizationUsed,
        LicenseType: content.LicenseType,
        Library: content.Library,
        Implementation: content.Implementation,
        files: await extractFiles(content.SourceCode, params),
        EVMVersion: content.EVMVersion,
        ContractName: content.ContractName,
        ConstructorArguments: content.ConstructorArguments,
        CompilerVersion: content.CompilerVersion,
        ABI: content.ABI,
      }
      await s3upload({
        ...params,
        Body: JSON.stringify(body),
      })
    } catch (error) {
      body = {
        status: TransactionTraceResponseStatus.FAILED,
        message: "Can't convert files",
        error,
        ...data,
      }
      s3upload({
        ...params,
        Body: JSON.stringify(body),
      })
    }
  } else {
    body = {
      status: TransactionTraceResponseStatus.FAILED,
      ...data,
    }
    s3upload({
      ...params,
      Body: JSON.stringify(body),
    })
  }
  return body
}

export const parseS3File = async (address: Address) => {
  const params: PutObjectRequest = {
    Key: `contracts/${address.chainId}/${address.address}/payload.json`,
    Bucket: BUCKET_NAME,
  }
  let response: any = defaultStatus
  try {
    const resp = await s3download(params)
    const existingResponse = JSON.parse(
      (await resp.Body?.transformToString('utf8')) || '',
    )
    response = existingResponse
  } catch {
    response = await constructFiles(address, params)
  }
  return response
}
