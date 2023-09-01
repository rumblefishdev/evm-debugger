import type { ISrcMapApiPayload } from '@evm-debuger/types'
import { SrcMapStatus, ChainId } from '@evm-debuger/types'

import * as helpers from '../../src/helpers'
import * as s3 from '../../src/s3'
import { srcmapCompilerHandler } from '../../src/srcMapCompiler'

describe('Unit test for compiler', function () {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('srcmapCompilerHandler - if no sourceData should return payload with status COMPILATION_FAILED', async () => {
    jest.spyOn(helpers, 'compileFiles')
    jest.spyOn(s3, 'payloadSync')
    jest.spyOn(s3, 's3upload').mockImplementation()

    const initialPayload: ISrcMapApiPayload = {
      status: SrcMapStatus.COMPILATION_PENDING,
      chainId: ChainId.mainnet,
      address: '0x1234567890123456789012345678901234567890',
    }

    console.log(process.env.BUCKET_NAME)

    const result = await srcmapCompilerHandler(initialPayload)

    expect(helpers.compileFiles).toHaveBeenCalledTimes(0)
    expect(s3.payloadSync).toHaveBeenCalledTimes(2)
    expect(result.status).toBe(SrcMapStatus.COMPILATION_FAILED)
  })
})
