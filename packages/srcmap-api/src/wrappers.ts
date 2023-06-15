import { SrcMapResponseStatus } from '@evm-debuger/types'

export const createResponse = (status: string, output = {}) => {
  return {
    statusCode: [
      SrcMapResponseStatus.SUCCESS,
      SrcMapResponseStatus.PENDING,
    ].includes(status)
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
