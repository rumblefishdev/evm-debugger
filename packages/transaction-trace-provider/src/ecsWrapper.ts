/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/exports-last */
/* eslint-disable unicorn/prefer-at */
import { init, captureException } from '@sentry/node'

import { version } from '../package.json'

import { sqsConsumer } from './sqsConsumer'

init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const consumeSqsAnalyzeTx = async (event: any) => {
  if (!event) {
    console.log('No records to process')
    return 'No records to process'
  }

  const { txHash, chainId, hardhatForkingUrl } = event
  await sqsConsumer({ txHash, hardhatForkingUrl, chainId, captureException })
}

console.log(`started with: ${process.env.SQSEvent}`)
const parsedEvent = JSON.parse(process.env.SQSEvent as string)
consumeSqsAnalyzeTx(parsedEvent)
