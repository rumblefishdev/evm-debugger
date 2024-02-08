import type { Handler, SQSEvent } from 'aws-lambda'
import type { RunTaskCommandInput } from '@aws-sdk/client-ecs'
import { ECS, LaunchType, AssignPublicIp } from '@aws-sdk/client-ecs'
import { AWSLambda, captureException } from '@sentry/serverless'

import { version } from '../package.json'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'transaction-trace-trigger-ecs-task')

// eslint-disable-next-line @typescript-eslint/require-await
export const triggerEcsTask: Handler = async (event: SQSEvent) => {
  const ecs = new ECS()
  const records = event.Records
  if (records.length === 0) {
    console.log('No records to process')
    return 'No records to process'
  }

  const txHash = records[0].messageAttributes.txHash.stringValue!
  const chainId = records[0].messageAttributes.chainId.stringValue!
  const hardhatForkingUrl = records[0].messageAttributes.hardhatForkingUrl.stringValue!
  try {
    const params: RunTaskCommandInput = {
      taskDefinition: process.env.ECS_TASK_ARN,
      overrides: {
        containerOverrides: [
          {
            name: 'transactionTraceProvider',
            environment: [
              {
                value: JSON.stringify({ txHash, hardhatForkingUrl, chainId }),
                name: 'SQSEvent',
              },
            ],
          },
        ],
      },
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: ['subnet-0141046f758995d49'],
          securityGroups: ['sg-0170de94a26662c81'],
          assignPublicIp: AssignPublicIp.ENABLED,
        },
      },
      launchType: LaunchType.FARGATE,
      count: 1,
      cluster: process.env.ECS_CLUSTER_ARN,
    }
    console.log(JSON.stringify(params))
    const test = await ecs.runTask(params)
    console.log(test)
  } catch (error) {
    captureException(error)
    console.log(error)
  }
}

export const triggerEcsTaskEntrypoint = AWSLambda.wrapHandler(triggerEcsTask)
