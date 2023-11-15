import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import type {
  PutCommandInput,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { ChainId } from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
})

const dynamoDbClient = DynamoDBDocumentClient.from(ddbClient)

interface IContractStatusDDBItem {
  chainId: ChainId
  address: string
  status: SrcMapStatus
  timestamp: number
  message?: string
}

export const getContractStatus = async (
  chainId: ChainId,
  address: string,
): Promise<IContractStatusDDBItem | undefined> => {
  const params: QueryCommandInput = {
    TableName: process.env.SRCMAP_TABLE_NAME,
    ScanIndexForward: false,
    Limit: 1,
    KeyConditionExpression: 'address = :address',
    FilterExpression: 'chainId = :chainId',
    ExpressionAttributeValues: {
      ':chainId': { N: chainId.toString() },
      ':address': { S: address },
    },
  }

  const command = new QueryCommand(params)
  const result: QueryCommandOutput = await dynamoDbClient.send(command)
  const items: IContractStatusDDBItem[] | undefined = (result.Items || []).map(
    (item: Record<string, { N: string; S: string }>) => ({
      timestamp: parseInt(item.timestamp.N, 10),
      status: item.status.S as SrcMapStatus,
      message: item.message?.S,
      chainId: parseInt(item.chainId.N, 10) as ChainId,
      address: item.address.S,
    }),
  )
  return items?.[0]
}

export const setContractStatus = async (
  chainId: ChainId,
  address: string,
  status: SrcMapStatus,
  message?: string,
) => {
  const params: PutCommandInput = {
    TableName: process.env.SRCMAP_TABLE_NAME,
    Item: {
      timestamp: Date.now(),
      status,
      message,
      chainId,
      address,
    },
  }
  const command = new PutCommand(params)
  return dynamoDbClient.send(command)
}

export const putStatusToDdb = async (address: string, chainId: string) => {
  const initDetails = {
    'type#time': 'TRANSACTION',
    timestamp: Date.now().toString(),
    status: SrcMapStatus.PENDING,
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

export const putTxEventToDdb = (
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
