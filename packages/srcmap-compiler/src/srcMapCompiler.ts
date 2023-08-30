/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import type { APIGatewayProxyEvent } from 'aws-lambda'
import { AWSLambda } from '@sentry/serverless'
import type { ISrcMapApiPayload } from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'

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

export const srcmapCompilerHandler = async (payload: ISrcMapApiPayload) => {
  if (payload && Object.keys(payload).length > 0) {
    console.log('srcmapCompilerHandler event:', JSON.stringify(payload))
    const solc = await getSolcModule(
      payload.sourceData?.CompilerVersion.split('+')[0],
    )
    try {
      const response = await compileFiles(payload, solc)
      return createResponse(SrcMapStatus.SUCCESS, {
        response,
      })
    } catch (error) {
      console.log({ error })
      return createResponse(SrcMapStatus.FAILED, { error })
    }
  }
  return createResponse(SrcMapStatus.FAILED)
}

export const srcmapCompilerEntrypoint = AWSLambda.wrapHandler(
  srcmapCompilerHandler,
)
