/* eslint-disable import/exports-last */
/* eslint-disable no-await-in-loop */
import type { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { SrcMapStatus } from '@evm-debuger/types'
import type { ISrcMapApiPayload, TSrcMapAddres } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'

import { version } from '../package.json'

import { createResponse } from './wrappers'
import { getDdbContractInfo, setDdbContractInfo } from './ddb'
import { triggerFetchSourceCode, triggerSourceMapCompiler } from './triggers'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-api')

export const addressesProcessing = async (
  contractAddressObj: TSrcMapAddres,
  awsRequestId: string,
): Promise<ISrcMapApiPayload> => {
  console.log(contractAddressObj.address, '/Processing/Start')

  let payload = await getDdbContractInfo(
    contractAddressObj.chainId,
    contractAddressObj.address,
  )

  if (!payload) {
    console.log(contractAddressObj.address, '/Processing/Creating new record')
    payload = await setDdbContractInfo({
      status: SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_PENDING,
      chainId: contractAddressObj.chainId,
      address: contractAddressObj.address,
    })
  } else {
    console.log(contractAddressObj.address, '/Processing/Found record')
  }

  if (
    [
      SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_PENDING,
      SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_FAILED,
      SrcMapStatus.SOURCE_DATA_FETCHING_FAILED,
      SrcMapStatus.FILES_EXTRACTING_FAILED,
      SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_TO_DLQ,
    ].includes(payload.status) ||
    // Run fetch queuing if last fetch was more than 30 seconds ago
    (payload.status === SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_SUCCESS &&
      payload.timestamp !== undefined &&
      Date.now() - 30000 > payload.timestamp)
  ) {
    console.log(payload.address, '/Queuing Contract Fetch/Initialing')
    payload = await triggerFetchSourceCode(payload, awsRequestId)
  }

  console.log(payload.address, '/Payload', JSON.stringify(payload, null, 2))
  if (
    payload.compilerVersion &&
    payload.pathSourceData &&
    payload.pathSourceFiles &&
    [SrcMapStatus.FILES_EXTRACTING_SUCCESS].includes(payload.status)
  ) {
    console.log(payload.address, '/Compiler Trigger/Initialing')
    payload = await triggerSourceMapCompiler(payload, awsRequestId)
  }

  console.log(contractAddressObj.address, '/Processing/Done')
  return payload
}

export const srcmapApiHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  let addresses: TSrcMapAddres[] = []
  let transactionHash: string | undefined

  if (event.body) {
    addresses = JSON.parse(event.body)?.addresses
    transactionHash = JSON.parse(event.body)?.transactionHash
  }

  if (!addresses || addresses.length === 0)
    return createResponse(
      {
        status: SrcMapStatus.FAILED,
        error: 'Invalid params - No addresses provided',
      },
      context.awsRequestId,
    )

  if (!transactionHash) {
    return createResponse(
      {
        status: SrcMapStatus.FAILED,
        error: 'Invalid params - No transaction hash provided',
      },
      context.awsRequestId,
    )
  }

  // Remove duplicates
  addresses = addresses
    .map((addressObj) => ({
      ...addressObj,
      address: addressObj.address.toLowerCase(),
    }))
    .filter((addressObj, index, self) => {
      const foundIndex = self.findIndex(
        (element) => element.address === addressObj.address,
      )
      return foundIndex === index
    })

  console.log(
    `Processing transaction: ${transactionHash}\nWith contracts:\n`,
    JSON.stringify(addresses, null, 2),
  )
  try {
    const responseContainer = (
      await Promise.all(
        addresses.map((addressObj) => addressesProcessing(addressObj, context.awsRequestId)),
      )
    ).reduce((accumulator: Record<string, ISrcMapApiPayload>, element) => {
      accumulator[element.address] = element
      return accumulator
    }, {})

    return createResponse(
      {
        status: SrcMapStatus.SUCCESS,
        data: responseContainer,
      },
      context.awsRequestId,
    )
  } catch (error) {
    if (error instanceof Error) {
      captureException(error)
      return createResponse(
        {
          status: SrcMapStatus.FAILED,
          error: error.message,
        },
        context.awsRequestId,
      )
    }
  }

  return createResponse(
    {
      status: SrcMapStatus.FAILED,
      error: 'Unknown error',
    },
    context.awsRequestId,
  )
}

export const srcmapApiEntrypoint = AWSLambda.wrapHandler(srcmapApiHandler)
