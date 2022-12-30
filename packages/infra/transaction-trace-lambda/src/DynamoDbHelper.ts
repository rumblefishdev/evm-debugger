import {AnalyzerData} from "./AnalyzerData";
import * as AWS from "aws-sdk";

export const saveAnalyzerData = async (analyzerData: AnalyzerData) => {
    const ddb = new AWS.DynamoDB();
    const params = {
        TableName: process.env.ANALYZER_DATA_TABLE_NAME,
        Item: {
            executionArn: { S: analyzerData.taskArn },
            txHash: { S: analyzerData.txHash },
            chainId: { N: analyzerData.chainId },
        },
    };

    await ddb.putItem(params).promise()
};

export const getAnalyzerDataByTxHash = async (txHash: string): Promise<AnalyzerData> => {
    const ddb = new AWS.DynamoDB();

    const params = {
        TableName: process.env.ANALYZER_DATA_TABLE_NAME,
        Key: {
            txHash: { S: txHash },
        },
    };

    const data = await ddb.getItem(params).promise();
    if (!data.Item) return null;

    return {
        txHash: data.Item.txHash.S,
        chainId: data.Item.chainId.N,
        taskArn: data.Item.executionArn.S,
    };
};