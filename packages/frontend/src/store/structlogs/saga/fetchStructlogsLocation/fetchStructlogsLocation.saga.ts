// export class TransactionTraceFetcher implements IStructLogProvider {
//   constructor(private transactionTraceProviderUrl: string, public hash: string, private chainId: number) {}

import { call, delay, put, type SagaGenerator } from 'typed-redux-saga'
import { TransactionTraceResponseStatus, type ChainId } from '@evm-debuger/types'

import { structLogsActions, type TStructLogsActions } from '../../structlogs.slice'
import type { TStructlogResponse } from '../../structlogs.types'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { LogMessageStatus } from '../../../analyzer/analyzer.const'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'

export async function fetchStructlogsLocation(
  chainId: ChainId,
  transactionHash: string,
): Promise<Pick<TStructlogResponse, 'status' | 's3Location'>> {
  const response = await fetch(`${this.transactionTraceProviderUrl}/analyzerData/${transactionHash}/${chainId}`)
  const { status, s3Location }: TStructlogResponse = await response.json()

  return { status, s3Location }
}

export function* fetchStructlogsLocationSaga({ payload }: TStructLogsActions['fetchStructlogsLocation']): SagaGenerator<void> {
  const { chainId, transactionHash } = payload

  const { s3Location, status } = yield* call(fetchStructlogsLocation, chainId, transactionHash)

  if (status === TransactionTraceResponseStatus.PENDING || status === TransactionTraceResponseStatus.RUNNING) {
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: `Fetching structLogs location status: ${status}` }))
    yield* delay(15_000)
    yield* put(structLogsActions.fetchStructlogsLocation)
  }

  if (status === TransactionTraceResponseStatus.FAILED) {
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.ERROR, message: `Fetching structLogs location status: ${status}` }))
  }

  if (status === TransactionTraceResponseStatus.SUCCESS) {
    yield* put(
      analyzerActions.addLogMessage({ status: LogMessageStatus.SUCCESS, message: `Fetching structLogs location status: ${status}` }),
    )
    yield* put(transactionConfigActions.setS3Location({ s3Location }))
  }
}
