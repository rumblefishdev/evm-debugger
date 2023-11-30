import type { APIGatewayProxyResult, Context } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { SQSClient } from '@aws-sdk/client-sqs'
import timekeeper from 'timekeeper'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { createLambdaEvent } from '../utils/lambdaMocks'
import {
  getMockCalledInput,
  getMockCalledInputItem,
} from '../utils/awsMocksHelper'
import { analyzeTransactionHandler } from '../../src/txTraceApi'

const ddbMock = mockClient(DynamoDBDocumentClient)
const sqsMock = mockClient(SQSClient)

describe('Unit test for api', function () {
  const TX_HASH =
    '0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9'
  const CHAIN_ID = '1'
  const txInitDetails = {
    txHash: TX_HASH,
    chainId: CHAIN_ID,
  }
  const testEvent = createLambdaEvent(txInitDetails)

  // TODO: Mock this context in better way
  // Do not use aws-lambda-mock-context because it is not maintained
  const ctx: Context = {
    succeed: () => {},
    memoryLimitInMB: '128',
    logStreamName: '2014/02/14/[HEAD]13370a84ca4ed8b77c427af260',
    logGroupName: 'transaction-trace-api',
    invokedFunctionArn:
      'arn:aws:lambda:us-east-1:123456789012:function:transaction-trace-api',
    getRemainingTimeInMillis: () => 1000,
    functionVersion: '1',
    functionName: 'transaction-trace-api',
    fail: () => {},
    done: () => {},
    callbackWaitsForEmptyEventLoop: true,
    awsRequestId: '123',
  }

  beforeAll(() => {
    timekeeper.freeze(new Date('2014-01-01'))
  })
  beforeEach(() => {
    ddbMock.reset()
    sqsMock.reset()
  })
  afterAll(() => {
    timekeeper.reset()
  })

  it('create analyze if 1st time', async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [] })

    const result: APIGatewayProxyResult = await analyzeTransactionHandler(
      testEvent,
      ctx,
    )
    expect(ddbMock.calls().length).toEqual(2)
    expect(sqsMock.calls().length).toEqual(1)

    const putTxInfoInput = getMockCalledInputItem(ddbMock, 1)
    expect(putTxInfoInput.txHash).toEqual(TX_HASH)
    expect(putTxInfoInput.chainId).toEqual(CHAIN_ID)
    expect(putTxInfoInput.status).toEqual(
      TransactionTraceResponseStatus.PENDING,
    )
    expect(putTxInfoInput['type#time']).toEqual('TRANSACTION')

    expect(getMockCalledInput(sqsMock, 0)).toMatchSnapshot()

    expect(result.statusCode).toEqual(200)
    const txResponse = JSON.parse(result.body)
    expect(txResponse).toMatchSnapshot()
  })

  it('already in progress, return status', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          ...txInitDetails,
        },
        {
          txHash: TX_HASH,
          status: TransactionTraceResponseStatus.RUNNING,
        },
      ],
    })

    const result: APIGatewayProxyResult = await analyzeTransactionHandler(
      testEvent,
      ctx,
    )
    expect(ddbMock.calls().length).toEqual(1)
    expect(sqsMock.calls().length).toEqual(0)

    expect(result.statusCode).toEqual(200)
    const txResponse = JSON.parse(result.body)
    expect(txResponse).toMatchSnapshot()
  })

  it('rerun analyze on failed tx', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          ...txInitDetails,
        },
        {
          txHash: TX_HASH,
          status: TransactionTraceResponseStatus.FAILED,
        },
        {
          txHash: TX_HASH,
          status: TransactionTraceResponseStatus.RUNNING,
        },
      ],
    })

    const result: APIGatewayProxyResult = await analyzeTransactionHandler(
      testEvent,
      ctx,
    )
    expect(ddbMock.calls().length).toEqual(2)
    expect(sqsMock.calls().length).toEqual(1)

    const putTxEventInput = getMockCalledInputItem(ddbMock, 1)
    expect(putTxEventInput.status).toEqual(
      TransactionTraceResponseStatus.PENDING,
    )

    expect(result.statusCode).toEqual(200)
    const txResponse = JSON.parse(result.body)
    expect(txResponse).toMatchSnapshot()
  })

  it('analyze success', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          txHash: TX_HASH,
          status: TransactionTraceResponseStatus.PENDING,
          s3Location: `trace/${CHAIN_ID}/${TX_HASH}`,
          chainId: CHAIN_ID,
        },
        {
          txHash: TX_HASH,
          status: TransactionTraceResponseStatus.SUCCESS,
        },
        {
          txHash: TX_HASH,
          status: TransactionTraceResponseStatus.RUNNING,
        },
      ],
    })

    const result: APIGatewayProxyResult = await analyzeTransactionHandler(
      testEvent,
      ctx,
    )
    expect(ddbMock.calls().length).toEqual(1)
    expect(sqsMock.calls().length).toEqual(0)

    expect(result.statusCode).toEqual(200)
    const txResponse = JSON.parse(result.body)
    expect(txResponse).toMatchSnapshot()
  })
})
