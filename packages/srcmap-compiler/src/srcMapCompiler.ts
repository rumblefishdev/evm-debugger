/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import type { APIGatewayProxyEvent } from 'aws-lambda'
import { AWSLambda } from '@sentry/serverless'
import { SrcMapResponseStatus } from '@evm-debuger/types'

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
    return require('./solc').default
  } catch (error) {
    console.log('Cant find solc', error)
    return null
  }
}

export const srcmapCompilerHandler = async (event: APIGatewayProxyEvent) => {
  if (event && Object.keys(event).length > 0) {
    console.log('srcmapCompilerHandler event:', JSON.stringify(event))
    const payload = event as any
    const solc = await getSolcModule(payload.CompilerVersion.split('+')[0])
    try {
      const response = await compileFiles(payload, solc)
      return createResponse(SrcMapResponseStatus.SUCCESS, {
        response,
      })
    } catch (error) {
      console.log({ error })
      return createResponse(SrcMapResponseStatus.FAILED, { error })
    }
  }
  return createResponse(SrcMapResponseStatus.FAILED)
}

export const srcmapCompilerEntrypoint = AWSLambda.wrapHandler(
  srcmapCompilerHandler,
)
