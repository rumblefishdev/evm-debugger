import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import hardhat from 'hardhat'
import { S3Client } from '@aws-sdk/client-s3'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import type { Callback, Context } from 'aws-lambda'

import { createSQSRecordEvent } from '../utils/lambdaMocks'
import { consumeSqsAnalyzeTx } from '../../src/sqsConsumer'
import { sampleTraceResult } from '../utils/testStructs'
import { getMockCalledInput, getMockCalledInputItem } from '../utils/awsMocksHelper'

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

    const TX_HASH = '0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9'
    const CHAIN_ID = '1'
    const HARDHAT_FORKING_URL = ' https://eth-mainnet.alchemyapi.io/v2/abcd'
    const testEvent = createSQSRecordEvent(TX_HASH, CHAIN_ID, HARDHAT_FORKING_URL)
    const bucketName = 'www.bucket.com'
    process.env.ANALYZER_DATA_BUCKET_NAME = bucketName
    await consumeSqsAnalyzeTx(testEvent, {} as Context, {} as Callback)
    const expectedS3CallStructure = {
      Key: '1/0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9/trace.json',
      ContentType: 'application/json',
      Bucket: bucketName,
      Body: '{"structLogs":[{"storage":{},"stack":[],"pc":0,"op":"PUSH1","memory":[],"gasCost":3,"gas":296346,"depth":1}]}',
    }

    expect(getMockCalledInput(s3ClientMock, 0)).toEqual(expectedS3CallStructure)

    expect(getMockCalledInputItem(ddbMock, 0).status).toEqual(TransactionTraceResponseStatus.RUNNING)
    expect(getMockCalledInputItem(ddbMock, 1).status).toEqual(TransactionTraceResponseStatus.SUCCESS)
    expect(getMockCalledInputItem(ddbMock, 1).s3Location).toEqual(`${bucketName}/${CHAIN_ID}/${TX_HASH}/trace.json`)
  })

  it('Add fail event in case of the error', async () => {
    const ERROR_MSG = 'Sample error during hardhat run'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hardhat.run = () => ({
      send: jest.fn().mockRejectedValue(new Error(ERROR_MSG)),
    })
    const TX_HASH = '0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9'
    const CHAIN_ID = '1'
    const HARDHAT_FORKING_URL = ' https://eth-mainnet.alchemyapi.io/v2/abcd'
    const testEvent = createSQSRecordEvent(TX_HASH, CHAIN_ID, HARDHAT_FORKING_URL)

    await consumeSqsAnalyzeTx(testEvent, {} as Context, {} as Callback)

    expect(s3ClientMock.calls().length).toEqual(0)
    expect(ddbMock.calls().length).toEqual(2)

    expect(getMockCalledInputItem(ddbMock, 0).status).toEqual(TransactionTraceResponseStatus.RUNNING)

    expect(getMockCalledInputItem(ddbMock, 1).status).toEqual(TransactionTraceResponseStatus.FAILED)
    expect(getMockCalledInputItem(ddbMock, 1).errorDetails).toEqual(ERROR_MSG)
  })
})
