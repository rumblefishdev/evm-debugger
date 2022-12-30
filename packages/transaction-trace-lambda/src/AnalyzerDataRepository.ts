import type * as AWS from 'aws-sdk'

import type { AnalyzerData } from './AnalyzerData'

export class AnalyzerDataRepository {
  constructor(private dynamodb: AWS.DynamoDB) {}

  async saveAnalyzerData(analyzerData: AnalyzerData) {
    const params = {
      TableName: process.env.ANALYZER_DATA_TABLE_NAME,
      Item: {
        txHash: { S: analyzerData.txHash },
        executionArn: { S: analyzerData.taskArn },
        chainId: { N: analyzerData.chainId },
      },
    }

    await this.dynamodb.putItem(params).promise()
  }

  async getAnalyzerDataByTxHash(txHash: string): Promise<AnalyzerData> {
    const params = {
      TableName: process.env.ANALYZER_DATA_TABLE_NAME,
      Key: {
        txHash: { S: txHash },
      },
    }

    const data = await this.dynamodb.getItem(params).promise()
    if (!data.Item) return null

    return {
      txHash: data.Item.txHash.S,
      taskArn: data.Item.executionArn.S,
      chainId: data.Item.chainId.N,
    }
  }
}
