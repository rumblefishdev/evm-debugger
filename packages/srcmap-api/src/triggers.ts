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
  contractInfo: ISrcMapApiPayload,
): Promise<ISrcMapApiPayload> => {
  console.log(contractInfo.address, '/Queuing Contract Fetch/Start')
  try {
    await putContractToDownloadSqs(contractInfo.address, contractInfo.chainId)
  } catch (error) {
    const message = '/Queuing Contract Fetch/Failed'
    captureMessage(message, 'error')
    console.warn(contractInfo.address, message)

    return setDdbContractInfo({
      ...contractInfo,
      status: SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_FAILED,
      message,
    })
  }

  return setDdbContractInfo({
    ...contractInfo,
    status: SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_SUCCESS,
  })
}

export const triggerSourceMapCompiler = async (_payload: ISrcMapApiPayload) => {
  console.log(_payload.address, '/Compiler Trigger/Start')

  const payload = await setDdbContractInfo({
    ..._payload,
    status: SrcMapStatus.COMPILATOR_TRIGGERRING_PENDING,
  })

  if (!payload.pathSourceData) {
    const msg = '/Compiler Trigger/No source data found'
    console.warn(payload.address, msg)
    return setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED,
      message: msg,
    })
  }

  if (!payload.compilerVersion) {
    const msg = '/Compiler Trigger/No compiler version found'
    console.warn(payload.address, msg)
    return setDdbContractInfo({
      ...payload,
      status: SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED,
      message: msg,
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
    Payload: new TextEncoder().encode(JSON.stringify(payload)),
    LogType: LogType.Tail,
    FunctionName: functionName,
  })
  lambda.send(command)

  console.log(_payload.address, '/Compiler Trigger/Lambda Started')
  return setDdbContractInfo({
    ...payload,
    status: SrcMapStatus.COMPILATOR_TRIGGERRING_SUCCESS,
  })
}
