import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import {
  getTransactionDetails,
  putTxDetailsToDdb,
  putTxEventToDdb,
} from './ddb'
import { putTxDetailsToSqs } from './sqs'

export const createResponse = (status: string, output = {}) => {
  return {
    statusCode: 200,
    headers: {
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
): Promise<APIGatewayProxyResult> => {
  const { txHash, chainId } = event.pathParameters!
  if (!txHash || !chainId)
    return createResponse(
      TransactionTraceResponseStatus.FAILED,
      'Invalid params',
    )

  try {
    let txDetails = await getTransactionDetails(txHash)

    if (txDetails === null) {
      txDetails = await putTxDetailsToDdb(txHash, chainId)
      await putTxDetailsToSqs(txHash, chainId)
    }

    if (txDetails.status === TransactionTraceResponseStatus.FAILED) {
      await putTxEventToDdb(TransactionTraceResponseStatus.PENDING, txHash)
      await putTxDetailsToSqs(txHash, chainId)
    }
    return createResponse(TransactionTraceResponseStatus.SUCCESS, txDetails)
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      return createResponse(
        TransactionTraceResponseStatus.FAILED,
        error?.message,
      )
    }
  }
  return createResponse(TransactionTraceResponseStatus.FAILED)
}
