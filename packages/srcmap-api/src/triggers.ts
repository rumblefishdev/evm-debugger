import { AWSLambda, captureMessage } from '@sentry/serverless'
import { InvokeCommand, LambdaClient, LogType } from '@aws-sdk/client-lambda'
import type { GetParameterCommandOutput } from '@aws-sdk/client-ssm'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import type { ISrcMapApiPayload } from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'

import { version } from '../package.json'

import { setDdbContractInfo } from './ddb'
import { putContractToDownloadSqs } from './sqs'

const { AWS_REGION, ENVIRONMENT, SENTRY_DSN } = process.env

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: ENVIRONMENT,
  dsn: SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-api')

const ssm = new SSMClient({ region: AWS_REGION })
const lambda = new LambdaClient({ region: AWS_REGION })

export const triggerFetchSourceCode = async (
  payload: ISrcMapApiPayload,
  awsRequestId: string,
): Promise<ISrcMapApiPayload> => {
  console.log(payload.address, '/Queuing Contract Fetch/Start')
  let messageId: string

  try {
    const sqsResponse = await putContractToDownloadSqs(
      payload.address,
      payload.chainId,
      awsRequestId,
    )
    messageId = sqsResponse.MessageId as string
  } catch (error) {
    const message = '/Queuing Contract Fetch/Failed'
    captureMessage(message, 'error')
    console.warn(payload.address, message)

    return setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_FAILED,
      message,
    })
  }

  const message = `/Queuing Contract Fetch/Success with message id: ${messageId}`
  console.log(payload.address, message)
  return setDdbContractInfo({
    ...payload,
    status: SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_SUCCESS,
    message,
  })
}

export const triggerSourceMapCompiler = async (
  _payload: ISrcMapApiPayload,
  awsRequestId: string,
) => {
  console.log(_payload.address, '/Compiler Trigger/Start')

  const payload = await setDdbContractInfo({
    ..._payload,
    status: SrcMapStatus.COMPILATOR_TRIGGERRING_PENDING,
    message: '',
  })

  if (!payload.pathSourceData) {
    const message = '/Compiler Trigger/No source data found'
    console.warn(payload.address, message)
    return setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED,
      message,
    })
  }

  if (!payload.compilerVersion) {
    const message = '/Compiler Trigger/No compiler version found'
    console.warn(payload.address, message)
    captureMessage(message, 'error')
    return setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED,
      message,
    })
  }

  const compilerVersion = payload.compilerVersion?.split('+')[0]
  const ssmPath = `/evm-debugger/${ENVIRONMENT}/${compilerVersion.replaceAll(
    '.',
    '-',
  )}`

  const ssmCommandObj = new GetParameterCommand({
    WithDecryption: false,
    Name: ssmPath,
  })

  let ssmValue: GetParameterCommandOutput
  try {
    ssmValue = await ssm.send(ssmCommandObj)
  } catch {
    const message = `/Compiler Trigger/No ssm parameter found for ${ssmPath}`
    console.warn(_payload.address, message)
    captureMessage(message, 'error')
    return setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED,
      message,
    })
  }
  const functionName = ssmValue.Parameter?.Value
  if (!functionName) {
    const message = `/Compiler Trigger/No function name found for ${ssmPath}`
    console.warn(_payload.address, message)
    captureMessage(message, 'error')
    return setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED,
      message,
    })
  }

  console.log(
    _payload.address,
    '/Compiler Trigger/Lambda to start/',
    functionName,
  )
  const command = new InvokeCommand({
    Payload: new TextEncoder().encode(
      JSON.stringify({
        payload,
        initialLambdaRequestId: awsRequestId,
      }),
    ),
    LogType: LogType.Tail,
    FunctionName: functionName,
  })

  lambda.send(command)

  const message = `/Compiler Trigger/Success`
  console.log(_payload.address, message)
  return setDdbContractInfo({
    ...payload,
    status: SrcMapStatus.COMPILATOR_TRIGGERRING_SUCCESS,
    message,
  })
}
