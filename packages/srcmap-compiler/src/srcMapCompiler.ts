/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import { AWSLambda, captureMessage } from '@sentry/serverless'
import type { ISrcMapApiPayload } from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'

import { version } from '../package.json'

import { compileFiles } from './helpers'
import { solcVersion } from './solc'
import { setDdbContractInfo } from './aws/ddb'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-compiler')
AWSLambda.setTag('solc_version', solcVersion)

export const srcmapCompilerHandler = async (
  _payload: ISrcMapApiPayload,
): Promise<ISrcMapApiPayload> => {
  const payload = await setDdbContractInfo({
    ..._payload,
    status: SrcMapStatus.COMPILATION_PENDING,
  })

  if (!payload.compilerVersion && !payload.pathSourceFiles?.length) {
    const message = '/Compilation/No sourceData or filesPath in payload'
    console.warn(payload.address, message)
    return setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message,
    })
  }

  try {
    return compileFiles(payload)
  } catch (error) {
    const message = `/Compilation/Unknow error while compiling:\n${error}`
    console.warn(payload.address, message)
    captureMessage(message, 'error')
    return setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message,
    })
  }
}

export const srcmapCompilerEntrypoint = AWSLambda.wrapHandler(
  srcmapCompilerHandler,
)
