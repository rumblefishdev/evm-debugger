import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'

import { version } from '../package.json'

import {
  getTransactionDetails,
  putTxDetailsToDdb,
  putTxEventToDdb,
} from './ddb'
import { putTxDetailsToSqs } from './sqs'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'transaction-trace-api')

export const createResponse = (
  status: string,
  requestId: string,
  output = {},
) => {
  return {
    statusCode: 200,
    headers: {
      'x-amzn-LambdaRequestId': requestId,
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status,
      ...output,
    }),
  }
}

export const analyzeTransactionHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { txHash, chainId, gasLimit } = event.pathParameters!
  if (!txHash || !chainId || !gasLimit)
    return createResponse(
      TransactionTraceResponseStatus.FAILED,
      'Invalid params',
    )

  try {
    let txDetails = await getTransactionDetails(txHash)

    if (txDetails === null) {
      txDetails = await putTxDetailsToDdb(txHash, chainId)
      await putTxDetailsToSqs(txHash, chainId, gasLimit)
    }

    if (txDetails.status === TransactionTraceResponseStatus.FAILED) {
      await putTxEventToDdb(TransactionTraceResponseStatus.PENDING, txHash)
      await putTxDetailsToSqs(txHash, chainId, gasLimit)
    }
    return createResponse(
      TransactionTraceResponseStatus.SUCCESS,
      context.awsRequestId,
      txDetails,
    )
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      captureException(error)
      return createResponse(
        TransactionTraceResponseStatus.FAILED,
        context.awsRequestId,
      )
    }
  }
  return createResponse(
    TransactionTraceResponseStatus.FAILED,
    context.awsRequestId,
  )
}

export const analyzeTransactionEntrypoint = AWSLambda.wrapHandler(
  analyzeTransactionHandler,
)
