/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import { AWSLambda } from '@sentry/serverless'
import type { ISrcMapApiPayload } from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'
import type { PutObjectRequest } from '@aws-sdk/client-s3'

import { version } from '../package.json'

import { compileFiles } from './helpers'
import { payloadSync } from './s3'
import { solcVersion } from './solc'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-compiler')
AWSLambda.setTag('solc_version', solcVersion)

const { BUCKET_NAME } = process.env

export const srcmapCompilerHandler = async (
  _payload: ISrcMapApiPayload,
): Promise<ISrcMapApiPayload> => {
  const payloadS3Params: PutObjectRequest = {
    Key: `contracts/${_payload.chainId}/${_payload.address}/payload.json`,
    Bucket: BUCKET_NAME,
  }

  const payload = await payloadSync(payloadS3Params, {
    ..._payload,
    status: SrcMapStatus.COMPILATION_PENDING,
  })

  if (!payload.sourceData?.CompilerVersion && !payload.filesPath?.length) {
    const msg = '/Compilation/No sourceData or filesPath in payload'
    console.warn(payload.address, msg)
    return payloadSync(payloadS3Params, {
      ...payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message: msg,
    })
  }

  try {
    return compileFiles(payload, payloadS3Params)
  } catch (error) {
    const msg = `/Compilation/Unknow error while compiling:\n${error}`
    console.warn(payload.address, msg)
    // Todo add sentry request
    return payloadSync(payloadS3Params, {
      ...payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message: msg,
    })
  }
}

export const srcmapCompilerEntrypoint = AWSLambda.wrapHandler(
  srcmapCompilerHandler,
)
