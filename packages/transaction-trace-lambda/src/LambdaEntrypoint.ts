import type { Context } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { TransactionTracResponseStatus } from '@evm-debuger/types'

import { TaskStatus } from './TaskStatus'
import { AnalyzerDataRepository } from './AnalyzerDataRepository'

const s3BucketName = process.env.TRANSACTION_TRACE_BUCKET
const analyzerDataRepository = new AnalyzerDataRepository(new AWS.DynamoDB())

export const runEcsTask = async (txHash, chainId) => {
  const params = {
    taskDefinition: process.env.ECS_TASK_DEFINITION,
    overrides: {
      containerOverrides: [
        {
          name: 'transactionTraceProvider',
          environment: [
            {
              value: txHash,
              name: 'TX_HASH',
            },
            {
              value: chainId,
              name: 'CHAIN_ID',
            },
            {
              value: process.env.HARDHAT_FORKING_URL,
              name: 'HARDHAT_FORKING_URL',
            },
            {
              value: s3BucketName,
              name: 'TRANSACTION_TRACE_BUCKET',
            },
          ],
        },
      ],
    },
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: process.env.SUBNETS.split(','),
        assignPublicIp: 'ENABLED',
      },
    },
    launchType: 'FARGATE',
    cluster: process.env.CLUSTER_ARN,
  }

  const ecsTask = await new AWS.ECS().runTask(params).promise()
  return ecsTask.tasks[0].taskArn
}

export const taskIsRunning = (taskStatus: string) => {
  return taskStatus !== TaskStatus.STOPPED
}

export const createResponse = (status: string, output: string) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status,
      output,
    }),
  }
}

export const getInfoAboutEcsTaskExecution = (taskArn: string) => {
  const params = {
    tasks: [taskArn],
    cluster: process.env.CLUSTER_ARN,
  }
  return new AWS.ECS().describeTasks(params).promise()
}

export const checkIfJsonExistsOnS3 = async (jsonS3Key: string) => {
  try {
    return await new AWS.S3()
      .getObjectAttributes({
        ObjectAttributes: ['ObjectParts'],
        Key: jsonS3Key,
        Bucket: s3BucketName,
      })
      .promise()
  } catch (error) {
    console.log(error)
    return null
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const checkState = async (event: any, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = true
  const analyzerData = await analyzerDataRepository.getAnalyzerDataByTxHash(
    event.pathParameters.txHash,
  )
  if (analyzerData) {
    console.log('analyzerData', analyzerData)

    const jsonS3Key = `trace/${analyzerData.chainId}/${analyzerData.txHash}.json`

    console.log('jsonS3Key', jsonS3Key)

    const jsonExists = await checkIfJsonExistsOnS3(jsonS3Key)

    console.log('jsonExists', jsonExists)

    if (jsonExists)
      return createResponse(TransactionTracResponseStatus.SUCCESS, jsonS3Key)

    const ecsTaskParameter = await getInfoAboutEcsTaskExecution(
      analyzerData.taskArn,
    )
    if (ecsTaskParameter.failures.length > 0)
      return createResponse(TransactionTracResponseStatus.FAILED, null)

    const currentTask = ecsTaskParameter.tasks.find(
      (task) => task.taskArn === analyzerData.taskArn,
    )
    if (taskIsRunning(currentTask?.lastStatus))
      return createResponse(TransactionTracResponseStatus.RUNNING, null)
  }
  const taskArn = await runEcsTask(
    event.pathParameters.txHash,
    event.pathParameters.chainId,
  )
  await analyzerDataRepository.saveAnalyzerData({
    txHash: event.pathParameters.txHash,
    taskArn,
    chainId: event.pathParameters.chainId,
  })

  return createResponse(TransactionTracResponseStatus.RUNNING, null)
}
