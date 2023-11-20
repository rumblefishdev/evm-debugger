import type { APIGatewayProxyResult } from 'aws-lambda'
import { ChainId, SrcMapStatus, type TSrcMapAddres } from '@evm-debuger/types'

import { createLambdaEvent } from '../utils/lambdaMocks'
import * as helpers from '../../src/lambdaFetcher'
import * as srcMapApi from '../../src/srcMapApi'
import { srcmapApiHandler } from '../../src/srcMapApi'

describe('Unit test for api handler', function () {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('addressProcessing - should run once if addresses array is passed', async () => {
    const addressObj: TSrcMapAddres = {
      chainId: ChainId.mainnet,
      address: '0xE7d3982E214F9DFD53d23a7f72851a7044072250',
    }
    const initDetails = { addresses: [addressObj] }
    const testEvent = createLambdaEvent(initDetails)
    jest
      .spyOn(helpers, 'addressesProcessing')
      .mockImplementation((contractAddressObj) =>
        Promise.resolve({
          ...contractAddressObj,
          status: SrcMapStatus.PENDING,
          sourceCode: 'test',
        }),
      )

    const result: APIGatewayProxyResult = await srcmapApiHandler(testEvent)
    expect(srcMapApi.addressesProcessing).toHaveBeenCalledTimes(1)
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
