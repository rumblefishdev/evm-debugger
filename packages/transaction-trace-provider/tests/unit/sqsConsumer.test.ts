import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import hardhat from 'hardhat'
import { S3Client } from '@aws-sdk/client-s3'
import { ChainId, TransactionTraceResponseStatus } from '@evm-debuger/types'
import type { Callback, Context } from 'aws-lambda'

import { createSQSRecordEvent } from '../utils/lambdaMocks'
import { consumeSqsAnalyzeTx } from '../../src/lambdaWrapper'
import { sampleTraceResult } from '../utils/testStructs'
import { getMockCalledInput, getMockCalledInputItem } from '../utils/awsMocksHelper'

const ddbMock = mockClient(DynamoDBDocumentClient)
const s3ClientMock = mockClient(S3Client)

const uploadIdMock = 'uploadId'
const ETagMock = 'ETag'

jest.mock('../../src/s3', () => ({
  ...jest.requireActual('../../src/s3'),
  uploadPart: jest.fn().mockResolvedValue(ETagMock),
  createMultiPartUpload: jest.fn().mockResolvedValue(uploadIdMock),
}))

jest.mock('../../hardhat.config.ts', () => ({
  config: {
    solidity: '0.8.9',
    paths: {
      cache: '/tmp/cache',
    },
    networks: {
      hardhat: {
        forking: {
          url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
        },
        chains: {
          11155111: {
            hardforkHistory: {
              shanghai: 3_100_000,
            },
          },
          421613: {
            hardforkHistory: {
              shanghai: 11_500_000,
            },
          },
          80001: {
            hardforkHistory: {
              shanghai: 33_130_000,
            },
          },
          42161: {
            hardforkHistory: {
              shanghai: 70_000_000,
            },
          },
          137: {
            hardforkHistory: {
              shanghai: 0,
            },
          },
        },
        chainId: 1,
      },
    },
  },
}))
jest.mock('hardhat', () => ({
  run: jest.fn(),
  ethers: {
    provider: {
      request: jest.fn(),
    },
  },
  config: {
    networks: {
      hardhat: {
        forking: {
          url: 'https://eth-mainnet.alchemyapi.io/v2/abcd',
        },
      },
    },
  },
}))

describe('Unit test for sqs consumer', function () {
  beforeEach(() => {
    ddbMock.reset()
    s3ClientMock.reset()
  })

  it('Analyze, upload and create ddb events', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        result: {
          number: '0x10',
        },
      }),
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hardhat.run = () => ({
      send: () => sampleTraceResult,
      request: jest.fn().mockResolvedValue({}),
    })

    const TX_HASH = '0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9'
    const CHAIN_ID = '1'
    const HARDHAT_FORKING_URL = 'https://eth-mainnet.alchemyapi.io/v2/abcd'
    const testEvent = createSQSRecordEvent(TX_HASH, CHAIN_ID, HARDHAT_FORKING_URL, '4444')
    const bucketName = 'www.bucket.com'
    process.env.ANALYZER_DATA_BUCKET_NAME = bucketName

    await consumeSqsAnalyzeTx(testEvent, {} as Context, {} as Callback)

    const expectedCompleteMultipartUploadCallStructure = {
      UploadId: uploadIdMock,
      MultipartUpload: {
        Parts: [
          {
            PartNumber: 1,
            ETag: ETagMock,
          },
        ],
      },
      Key: 'trace/1/0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9.json',
      Bucket: bucketName,
    }

    // expect(getMockCalledInput(s3ClientMock, 0)).toEqual(expectedCompleteMultipartUploadCallStructure)

    expect(getMockCalledInputItem(ddbMock, 0).status).toEqual(TransactionTraceResponseStatus.RUNNING)
    expect(getMockCalledInputItem(ddbMock, 1).status).toEqual(TransactionTraceResponseStatus.SUCCESS)
    expect(getMockCalledInputItem(ddbMock, 1).s3Location).toEqual(`${bucketName}/trace/${CHAIN_ID}/${TX_HASH}.json`)
    expect(fetch).toHaveBeenCalledWith(HARDHAT_FORKING_URL, {
      method: 'POST',
      body: JSON.stringify({ params: ['latest', false], method: 'eth_getBlockByNumber', jsonrpc: '2.0', id: 1 }),
    })
  })

  it('Add fail event in case of the error', async () => {
    const ERROR_MSG = 'Sample error during hardhat run'
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        result: {
          number: '0x10',
        },
      }),
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hardhat.run = () => ({
      send: jest.fn().mockRejectedValue(new Error(ERROR_MSG)),
      request: jest.fn().mockResolvedValue({}),
    })

    const TX_HASH = '0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9'
    const CHAIN_ID = '1'
    const HARDHAT_FORKING_URL = ' https://eth-mainnet.alchemyapi.io/v2/abcd'
    const testEvent = createSQSRecordEvent(TX_HASH, CHAIN_ID, HARDHAT_FORKING_URL, '4444')

    await consumeSqsAnalyzeTx(testEvent, {} as Context, {} as Callback)

    expect(s3ClientMock.calls().length).toEqual(0)
    expect(ddbMock.calls().length).toEqual(2)

    expect(getMockCalledInputItem(ddbMock, 0).status).toEqual(TransactionTraceResponseStatus.RUNNING)

    expect(getMockCalledInputItem(ddbMock, 1).status).toEqual(TransactionTraceResponseStatus.FAILED)
    expect(getMockCalledInputItem(ddbMock, 1).errorDetails).toEqual(ERROR_MSG)
  })
})
