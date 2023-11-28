/* eslint-disable @typescript-eslint/no-explicit-any */
import { AWSLambda, captureMessage } from '@sentry/serverless'
import type { Handler, SQSEvent } from 'aws-lambda'
import type {
  ISrcMapApiPayload,
  TSrcMapAddres,
  TEtherscanContractSourceCodeResp,
  TEtherscanParsedSourceCode,
  ChainId,
} from '@evm-debuger/types'
import { etherscanUrls, SrcMapStatus } from '@evm-debuger/types'
import fetch from 'node-fetch'

import { version } from '../package.json'

import { getDdbContractInfo, setDdbContractInfo } from './ddb'

const { SENTRY_DSN, ENVIRONMENT } = process.env

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: ENVIRONMENT,
  dsn: SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-fetcher-dlq')

export const srcmapFetcherDeadLetterHandler = async (event: SQSEvent) => {
  const promises = event.Records.map(async (record) => {
    const address = record.messageAttributes.address.stringValue!
    const chainId = parseInt(record.messageAttributes.chainId.stringValue!, 10)
    const requestId =
      record.messageAttributes.initialLambdaRequestId.stringValue!
    console.log('Initial Lambda Request ID:', requestId)

    const payload = await getDdbContractInfo(chainId, address)

    if (!payload) {
      await setDdbContractInfo({
        status: SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_TO_DLQ,
        chainId,
        address,
      })
    } else {
      await setDdbContractInfo({
        ...payload,
        status: SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_TO_DLQ,
        message: '',
      })
    }
  })
  await Promise.all(promises)
}

export const srcmapFetcherDeadLetterEntrypoint = AWSLambda.wrapHandler(
  srcmapFetcherDeadLetterHandler,
)
