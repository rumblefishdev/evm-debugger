/* eslint-disable @typescript-eslint/no-explicit-any */
import { AWSLambda, captureMessage } from '@sentry/serverless'
import type { SQSEvent } from 'aws-lambda'
import type {
  ISrcMapApiPayload,
  TEtherscanContractSourceCodeResp,
  TEtherscanParsedSourceCode,
} from '@evm-debuger/types'
import { etherscanUrls, SrcMapStatus } from '@evm-debuger/types'
import fetch from 'node-fetch'

import { version } from '../package.json'

import { getDdbContractInfo, setDdbContractInfo } from './ddb'
import { s3upload } from './s3'
import type { IFetcherPayload } from './types'

const { BUCKET_NAME, SENTRY_DSN, ENVIRONMENT } = process.env

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: ENVIRONMENT,
  dsn: SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-fetcher')

const fetchSourceData = async (
  _payload: ISrcMapApiPayload,
): Promise<IFetcherPayload> => {
  console.log(_payload.address, '/Etherscan/Fetching')

  // https://docs.etherscan.io/api-endpoints/contracts#get-contract-source-code-for-verified-contract-source-codes
  const _url = new URL(`${etherscanUrls[_payload.chainId].url}/api`)
  _url.searchParams.append('module', 'contract')
  _url.searchParams.append('action', 'getsourcecode')
  _url.searchParams.append('address', _payload.address)
  _url.searchParams.append('apikey', etherscanUrls[_payload.chainId].key)
  const ethUrl = _url.toString()

  const payload = await setDdbContractInfo({
    ..._payload,
    status: SrcMapStatus.SOURCE_DATA_FETCHING_PENDING,
    message: '',
  })

  const ethResp = await fetch(ethUrl)
  if (ethResp.status !== 200) {
    const message = `/Etherscan/Fetching failed with status: ${ethResp.status}`
    console.warn(payload.address, message)
    captureMessage(message, 'error')
    return {
      payload: await setDdbContractInfo({
        ...payload,
        status: SrcMapStatus.SOURCE_DATA_FETCHING_FAILED,
        message,
      }),
    }
  }

  const ethData: TEtherscanContractSourceCodeResp = await ethResp.json()
  if (ethData.status !== '1') {
    const message = `/Etherscan/Fetching failed\n: ${JSON.stringify(
      ethData,
      null,
      2,
    )}`
    console.warn(payload.address, message)
    captureMessage(message, 'error')
    return {
      payload: await setDdbContractInfo({
        ...payload,
        status: SrcMapStatus.SOURCE_DATA_FETCHING_FAILED,
        message,
      }),
    }
  }

  if (ethData.result[0].SourceCode === '') {
    const message = `/Etherscan/Not verified`
    console.warn(payload.address, message)
    return {
      payload: await setDdbContractInfo({
        ...payload,
        status: SrcMapStatus.SOURCE_DATA_FETCHING_NOT_VERIFIED,
        message,
      }),
    }
  }

  const sourceData = ethData.result[0]
  const sourceDataS3Path = `contracts/${payload.chainId}/${payload.address}/sourceData.json`

  await s3upload({
    Key: sourceDataS3Path,
    Bucket: BUCKET_NAME,
    Body: JSON.stringify(sourceData),
  })

  console.log(payload.address, '/Etherscan/Done')
  return {
    sourceData,
    payload: await setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.SOURCE_DATA_FETCHING_SUCCESS,
      pathSourceData: sourceDataS3Path,
      message: '',
      compilerVersion: sourceData.CompilerVersion,
    }),
  }
}

const extractFiles = async (
  fetcherPayload: IFetcherPayload,
): Promise<IFetcherPayload> => {
  console.log(fetcherPayload.payload.address, '/Extract Files/Start')

  const payload = await setDdbContractInfo({
    ...fetcherPayload.payload,
    status: SrcMapStatus.FILES_EXTRACTING_PENDING,
    message: '',
  })

  if (!fetcherPayload.sourceData?.SourceCode) {
    const message = "/Extract Files/Can't find source code"
    console.warn(payload.address, message)
    return {
      payload: await setDdbContractInfo({
        ...payload,
        status: SrcMapStatus.FILES_EXTRACTING_FAILED,
        message,
      }),
    }
  }

  const rawSourceCode = fetcherPayload.sourceData?.SourceCode.replace(
    /(\r\n)/gm,
    '',
  ).slice(1, -1)

  let toUpload: [string, string][] = []

  try {
    const sourceCodeObj: TEtherscanParsedSourceCode = JSON.parse(rawSourceCode)

    if (!sourceCodeObj.sources) {
      const message = "/Extract Files/Can't find source files"
      console.warn(payload.address, message)

      return {
        payload: await setDdbContractInfo({
          ...payload,
          status: SrcMapStatus.FILES_EXTRACTING_FAILED,
          message,
        }),
      }
    }

    toUpload = Object.keys(sourceCodeObj.sources).map((fileName) => [
      fileName,
      sourceCodeObj.sources[fileName].content,
    ])
  } catch {
    toUpload = [['main.sol', fetcherPayload.sourceData?.SourceCode]]
  }

  const uploaded: string[] = (
    await Promise.all(
      toUpload.map(async ([fileName, content]) => {
        const key = `contracts/${payload.chainId}/${payload.address}/contract_files/${fileName}`
        await s3upload({
          Key: key,
          Bucket: BUCKET_NAME,
          Body: content,
        })
        return key
      }),
    )
  ).filter(Boolean) as string[]

  console.log(payload.address, '/Extract Files/Done')
  return {
    payload: await setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.FILES_EXTRACTING_SUCCESS,
      pathSourceFiles: uploaded,
      message: '',
    }),
  }
}

export const srcmapFetcherHandler = async (event: SQSEvent) => {
  const records = event.Records
  if (!records || records.length === 0) {
    console.warn('No records')
    return
  }
  const address = records[0].messageAttributes.address.stringValue!
  const chainId = parseInt(
    records[0].messageAttributes.chainId.stringValue!,
    10,
  )

  console.log(address, '/Handler/Start')
  let payload = await getDdbContractInfo(chainId, address)

  if (!payload) {
    payload = await setDdbContractInfo({
      status: SrcMapStatus.SOURCE_DATA_FETCHING_PENDING,
      chainId,
      address,
    })
  }

  const fetcherPyload = await fetchSourceData(payload)
  if (
    fetcherPyload.sourceData &&
    [SrcMapStatus.SOURCE_DATA_FETCHING_SUCCESS].includes(
      fetcherPyload.payload.status,
    )
  ) {
    await extractFiles(fetcherPyload)
  }
}

export const srcmapFetcherEntrypoint =
  AWSLambda.wrapHandler(srcmapFetcherHandler)
