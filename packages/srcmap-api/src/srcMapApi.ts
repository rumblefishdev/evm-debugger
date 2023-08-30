/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import type { APIGatewayProxyEvent } from 'aws-lambda'
import { SrcMapStatus } from '@evm-debuger/types'
import type { TSrcMapAddres } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'

import { version } from '../package.json'

import { createResponse } from './wrappers'
import { addressesProcessing } from './helpers'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-api')

export const srcmapApiHandler = async (event: APIGatewayProxyEvent) => {
  let addresses: TSrcMapAddres[] = []
  if (event.body) addresses = JSON.parse(event.body)?.addresses

  if (!addresses || addresses.length === 0)
    return createResponse(
      SrcMapStatus.FAILED,
      'Invalid params - No addresses provided',
    )

  console.log('Processing\n', JSON.stringify(addresses, null, 2))
  try {
    const responseContainer = await Promise.all(
      addresses.map((addressObj) => addressesProcessing(addressObj)),
    )
    return createResponse(SrcMapStatus.SUCCESS, responseContainer)
  } catch (error) {
    if (error instanceof Error) {
      captureException(error)
      return createResponse(SrcMapStatus.FAILED, JSON.stringify(error, null, 2))
    }
  }
  return createResponse(SrcMapStatus.FAILED)
}

export const srcmapApiEntrypoint = AWSLambda.wrapHandler(srcmapApiHandler)
