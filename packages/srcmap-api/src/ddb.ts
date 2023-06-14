import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb'
import { SrcMapResponseStatus } from '@evm-debuger/types'

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
})

const dynamoDbClient = DynamoDBDocumentClient.from(ddbClient)

export const getTransactionDetails = async (txHash: string) => {
  const params = {
    TableName: process.env.ANALYZER_DATA_TABLE_NAME,
    ScanIndexForward: false,
    Limit: 2,
    KeyConditionExpression: 'txHash = :txHash',
    ExpressionAttributeValues: {
      ':txHash': txHash,
    },
  }
  const command = new QueryCommand(params)
  const { Items } = await dynamoDbClient.send(command)
  if (Items && Items.length > 0) {
    const transactionDetails = Items[0]
    const transactionLastEvent = Items[1] || Items[0]
    return {
      ...transactionDetails,
      ...transactionLastEvent,
    }
  }
  return null
}

export const putTxDetailsToDdb = async (txHash: string, chainId: string) => {
  const initTxDetails = {
    'type#time': 'TRANSACTION',
    txHash,
    timestamp: Date.now().toString(),
    status: SrcMapResponseStatus.PENDING,
    chainId,
  }
  const params = {
    TableName: process.env.ANALYZER_DATA_TABLE_NAME,
    Item: initTxDetails,
  }
  const command = new PutCommand(params)
  await dynamoDbClient.send(command)
  return initTxDetails
}

export const putTxEventToDdb = async (
  event: string,
  txHash: string,
  additionalData: object = {},
) => {
  const currentTimestamp = Date.now().toString()
  const params = {
    TableName: process.env.ANALYZER_DATA_TABLE_NAME,
    Item: {
      'type#time': `EVENT#${currentTimestamp}`,
      txHash,
      timestamp: currentTimestamp,
      status: event,
      ...additionalData,
    },
  }
  const command = new PutCommand(params)
  return dynamoDbClient.send(command)
}
