import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import hardhat from 'hardhat'
import { S3Client } from '@aws-sdk/client-s3'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import type { Callback, Context } from 'aws-lambda'

import { createSQSRecordEvent } from '../utils/lambdaMocks'
import { consumeSqsAnalyzeTx } from '../../src/sqsConsumer'
import { sampleTraceResult } from '../utils/testStructs'
import {
  getMockCalledInput,
  getMockCalledInputItem,
} from '../utils/awsMocksHelper'

jest.mock('hardhat')
jest.mock('@nomicfoundation/hardhat-network-helpers')

const ddbMock = mockClient(DynamoDBDocumentClient)
const s3ClientMock = mockClient(S3Client)

describe('Unit test for sqs consumer', function () {
  beforeEach(() => {
    ddbMock.reset()
    s3ClientMock.reset()
  })

  it('Analyze, upload and create ddb events', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hardhat.run = () => ({
      send: () => sampleTraceResult,
    })

    const TX_HASH =
      '0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9'
    const CHAIN_ID = '1'
    const HARDHAT_FORKING_URL = ' https://eth-mainnet.alchemyapi.io/v2/abcd'
    const testEvent = createSQSRecordEvent(
      TX_HASH,
      CHAIN_ID,
      HARDHAT_FORKING_URL,
    )

    await consumeSqsAnalyzeTx(testEvent, {} as Context, {} as Callback)
    const expectedS3CallStructure = {
      Key: 'trace/1/0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9.json',
      ContentType: 'application/json',
      Bucket: undefined,
      Body: '{"structLogs":[{"storage":{},"stack":[],"pc":0,"op":"PUSH1","memory":[],"gasCost":3,"gas":296346,"depth":1}]}',
    }

    expect(getMockCalledInput(s3ClientMock, 0)).toEqual(expectedS3CallStructure)

    expect(getMockCalledInputItem(ddbMock, 0).status).toEqual(
      TransactionTraceResponseStatus.RUNNING,
    )
    expect(getMockCalledInputItem(ddbMock, 1).status).toEqual(
      TransactionTraceResponseStatus.SUCCESS,
    )
  })
})
