/* eslint-disable no-return-await */
import { Buffer } from 'buffer'

import { call, put, select, type SagaGenerator } from 'typed-redux-saga'
import type { IStructLog } from '@evm-debuger/types'
import { FastJson } from 'fast-json'

import { structLogsActions } from '../../structlogs.slice'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from '../../../analyzer/analyzer.const'

export async function fetchStructlogs(s3Location: string): Promise<ArrayBuffer> {
  const transactionTrace = await fetch(`https://${s3Location}`)
  return await transactionTrace.arrayBuffer()
}

export function parseStructlogs(structlogsArrayBuffer: ArrayBuffer): IStructLog[] {
  const fastJson = new FastJson()

  const structLogs: IStructLog[] = []

  fastJson.on('structLogs[*]', (structLog) => {
    structLogs.push(JSON.parse(structLog.toString()))
  })

  window.Buffer = window.Buffer || Buffer
  fastJson.write(Buffer.from(structlogsArrayBuffer))

  // TODO: Fix in https://github.com/rumblefishdev/evm-debugger/issues/285
  return structLogs.map((structLog: IStructLog, index) => ({ ...structLog, index }))
}

export function* fetchStructlogsSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Downloading and parsing structLogs' }))
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.IN_PROGRESS,
        stageName: AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS,
      }),
    )

    const s3Location = yield* select(transactionConfigSelectors.selectS3Location)

    if (!s3Location) {
      throw new Error('S3 location is not set')
    }

    const structlogsArrayBuffer = yield* call(fetchStructlogs, s3Location)
    const structLogs = parseStructlogs(structlogsArrayBuffer)

    yield* put(structLogsActions.loadStructLogs(structLogs))

    yield* put(
      analyzerActions.addLogMessage({ status: LogMessageStatus.SUCCESS, message: 'Successfully downloaded and parsed structlogs' }),
    )
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS,
      }),
    )
  } catch (error) {
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.FAILED,
        stageName: AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS,
      }),
    )
    yield* put(
      analyzerActions.addLogMessage({
        status: LogMessageStatus.ERROR,
        message: `Error while downloading and parsing structlogs: ${error.message}`,
      }),
    )
  }
}
