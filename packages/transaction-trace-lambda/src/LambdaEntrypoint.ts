import {Context} from 'aws-lambda';
import * as AWS from 'aws-sdk';
import {ResponseStatus} from "./ResponseStatus";
import {TaskStatus} from "./TaskStatus";
import {LaunchType, DescribeTasksRequest, DescribeTasksResponse, RunTaskRequest} from "@aws-sdk/client-ecs";
import {AnalyzerDataRepository} from "./AnalyzerDataRepository";

const s3BucketName = process.env.HARDHAT_JSON_BASE_URL || 'transaction-trace-storage.rumblefish.dev';
const analyzerDataRepository = new AnalyzerDataRepository(new AWS.DynamoDB())

export const checkState = async (event: any, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = true
    const analyzerData = await analyzerDataRepository.getAnalyzerDataByTxHash(event.pathParameters.txHash);

    if (!analyzerData) {
        const taskArn = await runEcsTask(event.pathParameters.txHash, event.pathParameters.chainId)
        await analyzerDataRepository.saveAnalyzerData({
            txHash: event.pathParameters.txHash,
            chainId: event.pathParameters.chainId,
            taskArn: taskArn
        })

        return createResponse(ResponseStatus.RUNNING, null);
    } else {
        const ecsTaskParameter = await getInfoAboutEcsTaskExecution(analyzerData.taskArn)
        if (ecsTaskParameter.failures.length > 0) return createResponse(ResponseStatus.FAILED, null)

        const currentTask = ecsTaskParameter.tasks.find(task => task.taskArn === analyzerData.taskArn);
        if (taskIsRunning(currentTask.lastStatus)) return createResponse(ResponseStatus.RUNNING, null);
        else {
            const jsonS3Key = `hardhat/trace/${analyzerData.chainId}/${analyzerData.txHash}.json`;
            const jsonExists = await checkIfJsonExistsOnS3(jsonS3Key);
            if (jsonExists) return createResponse(ResponseStatus.SUCCESS, jsonS3Key);
            else return createResponse(ResponseStatus.FAILED, null);
        }
    }

}

export const checkIfJsonExistsOnS3 = async (jsonS3Key: string) => {
    try {
        return await new AWS.S3().getObjectAttributes({
            Bucket: s3BucketName,
            Key: jsonS3Key,
            ObjectAttributes: ["ObjectParts"]
        }).promise();
    } catch (ex) {
        console.error(ex);
        return null;
    }
}

export const taskIsRunning = (taskStatus: string) => {
    return taskStatus !== TaskStatus.STOPPED
}

export const createResponse = (status: string, output: string) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            status: status,
            output: output
        }),
    };
}

export const getInfoAboutEcsTaskExecution = async (taskArn: string): Promise<DescribeTasksResponse> => {
    const params: DescribeTasksRequest = {
        cluster: process.env.CLUSTER_ARN,
        tasks: [
            taskArn
        ]
    }
    return await new AWS.ECS().describeTasks(params).promise();

}

export const runEcsTask = async (txHash, chainId) => {
    const params: RunTaskRequest = {
        launchType: LaunchType.FARGATE,
        cluster: process.env.CLUSTER_ARN,
        taskDefinition: process.env.ECS_TASK_DEFINITION,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: process.env.SUBNETS.split(",")
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: "transactionTraceProvider",
                    environment: [
                        {
                            name: 'TX_HASH',
                            value: txHash
                        },
                        {
                            name: "CHAIN_ID",
                            value: chainId
                        },
                        {
                            name: "HARDHAT_FORKING_URL",
                            value: process.env.HARDHAT_FORKING_URL
                        }
                    ]
                }
            ]
        }
    }

    const ecsTask = await new AWS.ECS().runTask(params).promise();
    return ecsTask.tasks[0].taskArn
}
