import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import type {
  PutCommandInput,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type {
  ChainId,
  ISrcMapApiPayload,
  SrcMapStatus,
} from '@evm-debuger/types'

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION })

const dynamoDbClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
})

export const getDdbContractInfo = async (
  chainId: ChainId,
  address: string,
): Promise<ISrcMapApiPayload | undefined> => {
  const params: QueryCommandInput = {
    TableName: process.env.SRCMAP_CONTRACTS_TABLE_NAME,
    ScanIndexForward: false,
    Limit: 1,
    KeyConditionExpression: 'address = :address',
    FilterExpression: 'chainId = :chainId',
    ExpressionAttributeValues: {
      ':chainId': { S: chainId.toString() },
      ':address': { S: address.toLowerCase() },
    },
  }

  const command = new QueryCommand(params)
  const result: QueryCommandOutput = await dynamoDbClient.send(command)
  const items: ISrcMapApiPayload[] | undefined = (result.Items || []).map(
    (item: Record<string, { N: string; S: string; L: { S: string }[] }>) => ({
      timestamp: parseInt(item.timestamp.N, 10),
      status: item.status.S as SrcMapStatus,
      pathSources: item.pathSources?.S || '',
      pathSourceMap: item.pathSourceMap?.S || '',
      pathSourceFiles: item.pathSourceFiles?.L?.map((file) => file.S) || [],
      pathSourceData: item.pathSourceData?.S || '',
      pathCompilatorSettings: item.pathCompilatorSettings?.S || '',
      message: item.message?.S || '',
      compilerVersion: item.compilerVersion?.S || '',
      chainId: parseInt(item.chainId.S, 10) as ChainId,
      address: item.address.S,
    }),
  )
  return items?.[0]
}

export const setDdbContractInfo = async (
  data: ISrcMapApiPayload,
): Promise<ISrcMapApiPayload> => {
  const item = {
    timestamp: Date.now(),
    status: data.status,
    pathSources: data.pathSources || '',
    pathSourceMap: data.pathSourceMap || '',
    pathSourceFiles: data.pathSourceFiles || [],
    pathSourceData: data.pathSourceData || '',
    pathCompilatorSettings: data.pathCompilatorSettings || '',
    message: data.message || '',
    compilerVersion: data.compilerVersion || '',
    chainId: data.chainId,
    address: data.address.toLowerCase(),
  }
  const params: PutCommandInput = {
    TableName: process.env.SRCMAP_CONTRACTS_TABLE_NAME,
    Item: {
      ...item,
      chainId: String(item.chainId),
    },
  }
  const command = new PutCommand(params)
  await dynamoDbClient.send(command)
  return item
}
