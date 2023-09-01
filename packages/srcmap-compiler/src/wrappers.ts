import { SrcMapStatus } from '@evm-debuger/types'

export const createResponse = (status: string, output = {}) => {
  return {
    statusCode:
      status === SrcMapStatus.SUCCESS || SrcMapStatus.PENDING ? 200 : 400,
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
