import type { APIGatewayProxyResult } from 'aws-lambda'

import { createLambdaEvent } from '../utils/lambdaMocks'
import * as helpers from '../../src/helpers'
import { srcmapApiHandler } from '../../src/srcMapApi'

describe('Unit test for api', function () {
  it('creates pending file on s3', async () => {
    const ADDRESS = '0xE7d3982E214F9DFD53d23a7f72851a7044072250'
    const CHAIN_ID = '1'
    const initDetails = {
      addresses: [
        {
          chainId: CHAIN_ID,
          address: ADDRESS,
        },
      ],
    }
    const testEvent = createLambdaEvent(initDetails)
    jest
      .spyOn(helpers, 'parseS3File')
      .mockImplementation((address) => Promise.resolve({ address }))
    const result: APIGatewayProxyResult = await srcmapApiHandler(testEvent)
    expect(helpers.fetchPayloadFromS3).toHaveBeenCalledTimes(1)
    expect(result.statusCode).toEqual(200)
  })
  it('returns 400 if no address provided', async () => {
    const initDetails = {
      addresses: [],
    }
    const testEvent = createLambdaEvent(initDetails)

    const result: APIGatewayProxyResult = await srcmapApiHandler(testEvent)

    expect(result.statusCode).toEqual(400)
  })
})
