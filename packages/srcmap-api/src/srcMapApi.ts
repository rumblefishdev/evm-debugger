/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import type { APIGatewayProxyEvent } from 'aws-lambda'
import { SrcMapResponseStatus } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'

import { version } from '../package.json'

import { createResponse } from './wrappers'
import type { Address } from './helpers'
import { parseS3File } from './helpers'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-api')

export const srcmapApiHandler = async (event: APIGatewayProxyEvent) => {
  let addresses: Address[] = []
  if (event.body) addresses = JSON.parse(event.body)?.addresses

  if (!addresses || addresses.length === 0)
    return createResponse(SrcMapResponseStatus.FAILED, 'Invalid params')

  try {
    const responseContainer = await Promise.all(
      addresses.map((address) => parseS3File(address)),
    )
    return createResponse(SrcMapResponseStatus.SUCCESS, responseContainer)
  } catch (error) {
    if (error instanceof Error) {
      captureException(error)
      return createResponse(SrcMapResponseStatus.FAILED, JSON.stringify(error))
    }
  }
  return createResponse(SrcMapResponseStatus.FAILED)
}

export const srcmapApiEntrypoint = AWSLambda.wrapHandler(srcmapApiHandler)
