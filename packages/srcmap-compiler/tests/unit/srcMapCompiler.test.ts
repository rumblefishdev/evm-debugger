import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as helpers from '../../src/helpers'
import { srcmapCompilerHandler } from '../../src/srcMapCompiler'

describe('Unit test for compiler', function () {
  it('returns 400 if no data provided', async () => {
    jest.spyOn(helpers, 'compileFiles')
    const result: APIGatewayProxyResult = await srcmapCompilerHandler(
      {} as APIGatewayProxyEvent,
    )
    expect(helpers.compileFiles).toHaveBeenCalledTimes(0)
  })
})
