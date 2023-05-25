import { TransactionTraceResponseStatus } from '@evm-debuger/types'

export const createResponse = (status: string, output = {}) => {
  return {
    statusCode:
      status === TransactionTraceResponseStatus.SUCCESS ||
      TransactionTraceResponseStatus.PENDING
        ? 200
        : 400,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      data: {
        ...output,
      },
    }),
  }
}
