import { SrcMapResponseStatus } from '@evm-debuger/types'

export const createResponse = (status: string, output = {}) => {
  return {
    statusCode:
      status === SrcMapResponseStatus.SUCCESS || SrcMapResponseStatus.PENDING
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
