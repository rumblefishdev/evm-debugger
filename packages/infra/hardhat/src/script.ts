import {Callback, Context} from 'aws-lambda';
import * as AWS from 'aws-sdk';
import {getAnalyzerDataByTxHash, saveAnalyzerData} from "./DynamoDbHelper";
import {DescribeTasksRequest, RunTaskRequest} from "aws-sdk/clients/ecs";

// const s3BucketName = process.env.HARDHAT_JSON_BASE_URL || 'hardhat.rumblefish.dev';

export const checkState = async (event: any, context: Context, callback: Callback) => {
    // try {

        context.callbackWaitsForEmptyEventLoop = true
        console.log("EVENT_INFO:", event)
        const analyzerData = await getAnalyzerDataByTxHash(event.pathParameters.txHash);

        if (!analyzerData) {
            const taskArn = await runEcsTask(event.pathParameters.txHash, event.pathParameters.chainId)
            console.log("SAVE_START")
            await saveAnalyzerData({
                txHash: event.pathParameters.txHash,
                chainId: event.pathParameters.chainId,
                taskArn: taskArn
            })
            console.log("SAVE_DONE")
            callback(null, {status: 'ANALYZER_STARTED', output: null})
        } else {
            const ecsTaskParameter = await getInfoAboutEcsTaskExecution(analyzerData.taskArn)
            console.log("ecsTaskParameter: ", ecsTaskParameter)
            // if (ecsTaskParameter.tasks[0].lastStatus === 'RUNNING') callback(null, {status: 'RUNNING', output: null})
            // else if (ecsTaskParameter.tasks[0].lastStatus === 'FAILED') callback(null, {status: 'FAILED', output: null})
            // else if (ecsTaskParameter.tasks[0].lastStatus === 'SUCCEEDED') callback(null, {status: 'SUCCEEDED', output: ecsTaskParameter.$response.data})
        }
    // } finally {
    //     process.exit()
    // }

}

// export const prepareTransactionData = async (event: any, context: Context, callback: Callback) => {
//     console.log("PREPARE_EVENT:", event)
//     const hardhat = require("hardhat")
//     let hardhatProvider = await hardhat.run("node:get-provider");
//
//     const traceResult = await hardhatProvider.send('debug_traceTransaction', [event.txHash])
//     const uploadedTraceResult = await uploadJson(JSON.stringify(traceResult), `trace/${event.chainId}/${event.txHash}`);
//     const traceResultLocation = uploadedTraceResult.Location
//     console.log("LOCATION-2:", traceResultLocation)
//
//     callback(null, {
//         traceResultLocation: traceResultLocation
//     })
// }

export const getInfoAboutEcsTaskExecution = async (taskArn: string) => {
    const params: DescribeTasksRequest = {
        tasks: [
            taskArn
        ]
    }
    return await new AWS.ECS().describeTasks(params).promise();
    // const stepFunctions = new AWS.StepFunctions();
    // return await stepFunctions.describeExecution({
    //     executionArn: taskArn
    // }).promise();

}

export const runEcsTask = async (txHash, chainId) => {
    console.log("TASK: ", process.env.ECS_TASK_DEFINITION)
    const params: RunTaskRequest = {
        launchType: 'FARGATE',
        cluster: process.env.CLUSTER_ARN,
        taskDefinition: process.env.ECS_TASK_DEFINITION,
        networkConfiguration: {
          awsvpcConfiguration: {
              assignPublicIp: "ENABLED",
              subnets: [
                  "subnet-0b9aa96f",
                  "subnet-f4b2fddb"
              ]
          }
        },
        overrides: {
            containerOverrides: [
                {
                    name: "hardhat",
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
                            name: "ALCHEMY_KEY",
                            value: "PmDXrefs8kgu3ERHun0yjVkeGrVqs0MQ"
                        }
                    ]
                }
            ]
        }
    }
    const ecsTask = await new AWS.ECS().runTask(params).promise();

    console.log("TASKS:", ecsTask);

    return ecsTask.tasks[0].taskArn
}
