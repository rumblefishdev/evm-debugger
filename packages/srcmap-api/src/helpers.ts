/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { InvokeCommand, LambdaClient, LogType } from '@aws-sdk/client-lambda'
import type { GetParameterCommandOutput } from '@aws-sdk/client-ssm'
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import type {
  ISrcMapApiPayload,
  TSrcMapAddres,
  TEtherscanContractSourceCodeResp,
  TEtherscanParsedSourceCode,
} from '@evm-debuger/types'
import { etherscanUrls, SrcMapStatus } from '@evm-debuger/types'
import fetch from 'node-fetch'

const { BUCKET_NAME, AWS_REGION, ENVIRONMENT } = process.env

const s3 = new S3Client({
  region: AWS_REGION,
})

const ssm = new SSMClient({
  region: AWS_REGION,
})

const lambda = new LambdaClient({
  region: AWS_REGION,
})

const s3upload = function (params: PutObjectCommandInput) {
  const command = new PutObjectCommand(params)
  return s3.send(command)
}

const s3download = function (params: GetObjectCommandInput) {
  const command = new GetObjectCommand(params)
  return s3.send(command)
}

const payloadSync = async (
  params: PutObjectRequest,
  payload: ISrcMapApiPayload,
): Promise<ISrcMapApiPayload> => {
  await s3upload({
    ...params,
    Body: JSON.stringify(payload),
  })
  return payload
}

const uploadSourceFile = async (
  filename: string,
  body: string,
  params: PutObjectRequest,
): Promise<string | undefined> => {
  if (filename) {
    const key = params.Key?.replace(
      'payload.json',
      `contract_files/${filename}`,
    )
    await s3upload({
      Key: key,
      Bucket: params.Bucket,
      Body: body,
    })
    return key
  }
}

const fetchPayloadFromS3 = async (
  addressObj: TSrcMapAddres,
  payloadS3Params: PutObjectRequest,
): Promise<ISrcMapApiPayload | null> => {
  try {
    console.log(addressObj.address, '/S3/Fetching')
    const resp = await s3download(payloadS3Params)
    const existingPayload: ISrcMapApiPayload = JSON.parse(
      (await resp.Body?.transformToString('utf8')) || '',
    )
    console.log(addressObj.address, '/S3/Done')
    return existingPayload
  } catch (error) {
    console.log(addressObj.address, '/S3/Not found')
    return null
  }
}

const fetchSourceData = async (
  addressObj: TSrcMapAddres,
  payloadS3Params: PutObjectRequest,
): Promise<ISrcMapApiPayload> => {
  console.log(addressObj.address, '/Etherscan/Fetching')

  // https://docs.etherscan.io/api-endpoints/contracts#get-contract-source-code-for-verified-contract-source-codes
  const _url = new URL(`${etherscanUrls[addressObj.chainId].url}/api`)
  _url.searchParams.append('module', 'contract')
  _url.searchParams.append('action', 'getsourcecode')
  _url.searchParams.append('address', addressObj.address)
  _url.searchParams.append('apikey', etherscanUrls[addressObj.chainId].key)
  const ethUrl = _url.toString()

  const payload = await payloadSync(payloadS3Params, {
    status: SrcMapStatus.SOURCE_DATA_FETCHING_PENDING,
    chainId: addressObj.chainId,
    address: addressObj.address,
  })

  const ethResp = await fetch(ethUrl)
  if (ethResp.status !== 200) {
    const msg = `/Etherscan/Fetching failed with status: ${ethResp.status}`
    console.warn(addressObj.address, msg)
    // TODO Add sentry call
    return payloadSync(payloadS3Params, {
      ...payload,
      status: SrcMapStatus.SOURCE_DATA_FETCHING_FAILED,
      message: msg,
    })
  }

  const ethData: TEtherscanContractSourceCodeResp = await ethResp.json()
  if (ethData.status !== '1') {
    const msg = `/Etherscan/Fetching failed\n: ${JSON.stringify(
      ethData,
      null,
      2,
    )}`
    console.warn(addressObj.address, msg)
    // TODO Add sentry call
    return payloadSync(payloadS3Params, {
      ...payload,
      status: SrcMapStatus.SOURCE_DATA_FETCHING_FAILED,
      message: msg,
    })
  }

  if (ethData.result[0].SourceCode === '') {
    const msg = `/Etherscan/Not verified`
    console.warn(addressObj.address, msg)
    return payloadSync(payloadS3Params, {
      ...payload,
      status: SrcMapStatus.SOURCE_DATA_FETCHING_NOT_VERIFIED,
      message: msg,
    })
  }

  console.log(addressObj.address, '/Etherscan/Done')
  return payloadSync(payloadS3Params, {
    ...payload,
    status: SrcMapStatus.SOURCE_DATA_FETCHING_SUCCESS,
    sourceData: ethData.result[0],
  })
}

const extractFiles = async (
  _payload: ISrcMapApiPayload,
  payloadS3Params: PutObjectRequest,
): Promise<ISrcMapApiPayload> => {
  console.log(_payload.address, '/Extract Files/Start')

  const payload = await payloadSync(payloadS3Params, {
    ..._payload,
    status: SrcMapStatus.FILES_EXTRACTING_PENDING,
  })

  if (!payload.sourceData?.SourceCode) {
    const msg = "/Extract Files/Can't find source code"
    console.warn(_payload.address, msg)
    return payloadSync(payloadS3Params, {
      ...payload,
      status: SrcMapStatus.FILES_EXTRACTING_FAILED,
      message: msg,
    })
  }

  const rawSourceCode = payload.sourceData?.SourceCode.replace(
    /(\r\n)/gm,
    '',
  ).slice(1, -1)

  let toUpload: [string, string][] = []

  try {
    const sourceCodeObj: TEtherscanParsedSourceCode = JSON.parse(rawSourceCode)

    console.log('sourceCodeObj', sourceCodeObj)

    if (!sourceCodeObj.sources) {
      const msg = "/Extract Files/Can't find source files"
      console.warn(payload.address, msg)
      return payloadSync(payloadS3Params, {
        ...payload,
        status: SrcMapStatus.FILES_EXTRACTING_FAILED,
        message: msg,
      })
    }

    toUpload = Object.keys(sourceCodeObj.sources).map((fileName) => [
      fileName,
      sourceCodeObj.sources[fileName].content,
    ])
  } catch {
    toUpload = [['main.sol', rawSourceCode]]
  }

  const uploaded: string[] = (
    await Promise.all(
      toUpload.map(([fileName, content]) => {
        return uploadSourceFile(fileName, content, payloadS3Params)
      }),
    )
  ).filter(Boolean) as string[]

  console.log(_payload.address, '/Extract Files/Done')
  return payloadSync(payloadS3Params, {
    ...payload,
    status: SrcMapStatus.FILES_EXTRACTING_SUCCESS,
    filesPath: uploaded,
  })
}

const triggerSourceMapCompiler = async (
  _payload: ISrcMapApiPayload,
  payloadS3Params: PutObjectRequest,
) => {
  console.log(_payload.address, '/Compiler Trigger/Start')

  const payload = await payloadSync(payloadS3Params, {
    ..._payload,
    status: SrcMapStatus.COMPILATOR_TRIGGERRING_PENDING,
  })

  if (!payload.sourceData) {
    const msg = '/Compiler Trigger/No source data found'
    console.warn(payload.address, msg)
    return payloadSync(payloadS3Params, {
      ...payload,
      status: SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED,
      message: msg,
    })
  }

  const compilerVersion = payload.sourceData.CompilerVersion?.split('+')[0]
  const ssmPath = `/evm-debugger/${ENVIRONMENT}/${compilerVersion.replaceAll(
    '.',
    '-',
  )}`

  const ssmCommandObj = new GetParameterCommand({
    WithDecryption: false,
    Name: ssmPath,
  })

  let ssmValue: GetParameterCommandOutput
  try {
    ssmValue = await ssm.send(ssmCommandObj)
  } catch {
    const msg = `/Compiler Trigger/No ssm parameter found for ${ssmPath}`
    console.warn(_payload.address, msg)
    // TODO Add sentry call
    return payloadSync(payloadS3Params, {
      ...payload,
      status: SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED,
      message: msg,
    })
  }
  const functionName = ssmValue.Parameter?.Value
  if (!functionName) {
    const msg = `/Compiler Trigger/No function name found for ${ssmPath}`
    console.warn(_payload.address, msg)
    // TODO Add sentry call
    return payloadSync(payloadS3Params, {
      ...payload,
      status: SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED,
      message: msg,
    })
  }

  console.log(
    _payload.address,
    '/Compiler Trigger/Lambda to start/',
    functionName,
  )
  const command = new InvokeCommand({
    Payload: new TextEncoder().encode(JSON.stringify(payload)),
    LogType: LogType.Tail,
    FunctionName: functionName,
  })
  lambda.send(command)

  console.log(_payload.address, '/Compiler Trigger/Lambda Started')
  return payloadSync(payloadS3Params, {
    ...payload,
    status: SrcMapStatus.COMPILATOR_TRIGGERRING_SUCCESS,
  })
}

export const addressesProcessing = async (
  contractAddressObj: TSrcMapAddres,
): Promise<ISrcMapApiPayload> => {
  const payloadS3Params: PutObjectRequest = {
    Key: `contracts/${contractAddressObj.chainId}/${contractAddressObj.address}/payload.json`,
    Bucket: BUCKET_NAME,
  }

  console.log(contractAddressObj.address, '/Processing/Start')

  const s3Payload = await fetchPayloadFromS3(
    contractAddressObj,
    payloadS3Params,
  )
  if (s3Payload) {
    return s3Payload
  }

  let payload = await fetchSourceData(contractAddressObj, payloadS3Params)
  if (payload.status !== SrcMapStatus.SOURCE_DATA_FETCHING_SUCCESS) {
    return payload
  }

  payload = await extractFiles(payload, payloadS3Params)
  if (payload.status !== SrcMapStatus.FILES_EXTRACTING_SUCCESS) {
    return payload
  }

  if (payload.filesPath?.length) {
    payload = await triggerSourceMapCompiler(payload, payloadS3Params)
  }

  console.log(contractAddressObj.address, '/Processing/Done')
  return payload
}
