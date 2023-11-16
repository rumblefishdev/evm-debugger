/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import type { APIGatewayProxyEvent } from 'aws-lambda'
import { SrcMapStatus } from '@evm-debuger/types'
import type { ISrcMapApiPayload, TSrcMapAddres } from '@evm-debuger/types'
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

  if (event.body) {
    addresses = JSON.parse(event.body)?.addresses
  }

  if (!addresses || addresses.length === 0)
    return createResponse({
      status: SrcMapStatus.FAILED,
      error: 'Invalid params - No addresses provided',
    })

  console.log('Processing\n', JSON.stringify(addresses, null, 2))
  try {
    const responseContainer = (
      await Promise.all(
        addresses.map((addressObj) => addressesProcessing(addressObj)),
      )
    ).reduce((accumulator: Record<string, ISrcMapApiPayload>, element) => {
      accumulator[element.address] = element
      return accumulator
    }, {})

    return createResponse({
      status: SrcMapStatus.SUCCESS,
      data: responseContainer,
    })
  } catch (error) {
    if (error instanceof Error) {
      captureException(error)
      return createResponse({
        status: SrcMapStatus.FAILED,
        error: error.message,
      })
    }
  }

  return createResponse({
    status: SrcMapStatus.FAILED,
    error: 'Unknown error',
  })
}

export const srcmapApiEntrypoint = AWSLambda.wrapHandler(srcmapApiHandler)
