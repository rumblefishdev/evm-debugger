/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import childProcess from 'node:child_process'

import type { APIGatewayProxyEvent } from 'aws-lambda'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'

import { version } from '../package.json'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-compiler')

async function getSolcModule(solcVersion: string) {
  let solc = null
  try {
    solc = require(`solc${solcVersion}`)
  } catch (error) {
    console.log('Cant find solc', error)
  }

  if (!solc) {
    console.log(`Installing solc ${solcVersion}...`)
    await new Promise<void>((resolve, reject) => {
      childProcess.exec(
        `npm i --save solc${solcVersion}@npm:solc@${solcVersion}`,
        function (error, stdout, stderr) {
          if (error) {
            reject(error)
            return
          }

          console.log(stdout)
          console.log(stderr)
          resolve()
        },
      )
    })

    solc = require(`solc${solcVersion}`)
    console.log(`Installation done solc ${solcVersion}`)
  }

  return solc
}

export const srcmapCompilerHandler = async (event: APIGatewayProxyEvent) => {
  if (event.body) {
    const payload = JSON.parse(event.body)?.payload
    const solc = await getSolcModule(payload.CompilerVersion.split('+')[0])
    console.log('solc', solc)
  }
  return null
}

export const srcmapCompilerEntrypoint = AWSLambda.wrapHandler(
  srcmapCompilerHandler,
)
