import type { ISrcMapApiResponseBody } from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'

export const createResponse = (args: ISrcMapApiResponseBody) => {
  const isError = [SrcMapStatus.FAILED].includes(args.status)

  const body: ISrcMapApiResponseBody = {
    status: args.status,
    ...(isError ? { error: args.error } : { data: args.data }),
  }

  return {
    statusCode: isError ? 400 : 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  }
}
