import {AnalyzerData} from "./AnalyzerData";
import * as AWS from "aws-sdk";

export class AnalyzerDataRepository {

    constructor(private dynamodb: AWS.DynamoDB) {}

    async saveAnalyzerData (analyzerData: AnalyzerData) {
        const params = {
            TableName: process.env.ANALYZER_DATA_TABLE_NAME,
            Item: {
                executionArn: { S: analyzerData.taskArn },
                txHash: { S: analyzerData.txHash },
                chainId: { N: analyzerData.chainId },
            },
        };

        await this.dynamodb.putItem(params).promise()
    };

    async getAnalyzerDataByTxHash (txHash: string): Promise<AnalyzerData> {
        const params = {
            TableName: process.env.ANALYZER_DATA_TABLE_NAME,
            Key: {
                txHash: { S: txHash },
            },
        };

        const data = await this.dynamodb.getItem(params).promise();
        if (!data.Item) return null;

        return {
            txHash: data.Item.txHash.S,
            chainId: data.Item.chainId.N,
            taskArn: data.Item.executionArn.S,
        };
    }
}