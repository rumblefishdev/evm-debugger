/* eslint-disable no-return-await */

import { apply, call, put, select, type SagaGenerator } from 'typed-redux-saga'
import type { TRawStructLog } from '@evm-debuger/types'
import { FastJson } from 'fast-json'

import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'

export async function fetchStructlogs(s3Location: string): Promise<ArrayBuffer> {
  const transactionTrace = await fetch(`https://${s3Location}`)
  return await transactionTrace.arrayBuffer()
}

export function parseStructlogs(structlogsArrayBuffer: ArrayBuffer): TRawStructLog[] {
  const fastJson = new FastJson()

  const structLogs: TRawStructLog[] = []

  fastJson.on('structLogs[*]', (structLog) => {
    structLogs.push(JSON.parse(structLog.toString()))
  })

  fastJson.write(Buffer.from(structlogsArrayBuffer))

  return structLogs
}

export function* fetchStructlogsSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Downloading and parsing structLogs')))
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

    const structLogs = yield* call(parseStructlogs, structlogsArrayBuffer)

    const analyzer = yield* call(getAnalyzerInstance)
    yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputStructlogs.set, [structLogs])

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage('Successfully downloaded and parsed structlogs')))
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
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while downloading and parsing structlogs: ${error.message}`)))
  }
}
