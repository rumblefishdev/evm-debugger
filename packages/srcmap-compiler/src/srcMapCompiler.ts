/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import type { APIGatewayProxyEvent } from 'aws-lambda'
import { AWSLambda } from '@sentry/serverless'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { version } from '../package.json'

import { createResponse } from './wrappers'
import { compileFiles } from './helpers'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-compiler')

function getSolcModule(solcVersion: string) {
  try {
    console.log(`Reqire solc ${solcVersion}`)
    const solc = require(`./solc${solcVersion}`).default
    console.log(`Using solc ${solcVersion}`)
    return solc
  } catch (error) {
    console.log('Cant find solc', error)
    return null
  }
}

export const srcmapCompilerHandler = async (event: APIGatewayProxyEvent) => {
  console.log({ event })
  if (event.body) {
    const payload = JSON.parse(event.body)?.data[0]
    const solc = await getSolcModule(payload.CompilerVersion.split('+')[0])
    try {
      const response = await compileFiles(payload, solc)
      return createResponse(TransactionTraceResponseStatus.SUCCESS, {
        response,
      })
    } catch (error) {
      console.log(error)
      return createResponse(TransactionTraceResponseStatus.FAILED, { error })
    }
  }
  return createResponse(TransactionTraceResponseStatus.FAILED)
}

export const srcmapCompilerEntrypoint = AWSLambda.wrapHandler(
  srcmapCompilerHandler,
)
