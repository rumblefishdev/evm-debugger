import { SrcMapStatus } from '@evm-debuger/types'

export const createResponse = (status: string, output = {}) => {
  return {
    statusCode: [SrcMapStatus.SUCCESS, SrcMapStatus.PENDING].includes(
      status as SrcMapStatus,
    )
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
