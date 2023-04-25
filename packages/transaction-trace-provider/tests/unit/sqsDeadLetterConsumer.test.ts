import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import type { Callback, Context } from 'aws-lambda'

import { consumeSqsAnalyzeTxError } from '../../src/sqsDeadLetterConsumer'
import { createSQSRecordEvent } from '../utils/lambdaMocks'
import { getMockCalledInputItem } from '../utils/awsMocksHelper'

const ddbMock = mockClient(DynamoDBDocumentClient)

describe('Unit test for dead letter sqs consumer', function () {
  beforeEach(() => {
    ddbMock.reset()
  })

  it('Analyze, upload and create ddb events', async () => {
    const TX_HASH =
      '0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9'
    const CHAIN_ID = '1'
    const HARDHAT_FORKING_URL = ' https://eth-mainnet.alchemyapi.io/v2/abcd'
    const testEvent = createSQSRecordEvent(
      TX_HASH,
      CHAIN_ID,
      HARDHAT_FORKING_URL,
    )
    await consumeSqsAnalyzeTxError(testEvent, {} as Context, {} as Callback)
    expect(getMockCalledInputItem(ddbMock, 0).status).toEqual(
      TransactionTraceResponseStatus.FAILED,
    )
  })
})
