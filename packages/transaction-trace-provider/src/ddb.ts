import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const REGION = 'us-east-1'

const ddbClient = new DynamoDBClient({
  region: REGION,
})

const dynamoDbClient = DynamoDBDocumentClient.from(ddbClient)

export const putTxEventToDdb = async (
  event: string,
  txHash: string,
  additionalData: object = {},
) => {
  console.log(`Adding event ${event} - ${txHash}`)
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
