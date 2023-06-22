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

export const getStatus = async (address: string) => {
  const params = {
    TableName: process.env.SRCMAP_TABLE_NAME,
    ScanIndexForward: false,
    Limit: 2,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: {
      ':address': address,
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

export const putStatusToDdb = async (address: string, chainId: string) => {
  const initDetails = {
    'type#time': 'TRANSACTION',
    timestamp: Date.now().toString(),
    status: SrcMapResponseStatus.PENDING,
    chainId,
    address,
  }
  const params = {
    TableName: process.env.SRCMAP_TABLE_NAME,
    Item: initDetails,
  }
  const command = new PutCommand(params)
  await dynamoDbClient.send(command)
  return initDetails
}

export const putTxEventToDdb = async (
  event: string,
  address: string,
  additionalData: object = {},
) => {
  const currentTimestamp = Date.now().toString()
  const params = {
    TableName: process.env.SRCMAP_TABLE_NAME,
    Item: {
      'type#time': `EVENT#${currentTimestamp}`,
      timestamp: currentTimestamp,
      status: event,
      address,
      ...additionalData,
    },
  }
  const command = new PutCommand(params)
  return dynamoDbClient.send(command)
}
