/* eslint-disable no-return-await */

import { call, put, type SagaGenerator } from 'typed-redux-saga'
import type { IStructLog } from '@evm-debuger/types'
import { FastJson } from 'fast-json'

import { structLogsActions, type TStructLogsActions } from '../../structlogs.slice'

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

export function* fetchStructlogsSaga({ payload }: TStructLogsActions['fetchStructlogs']): SagaGenerator<void> {
  const { s3Location } = payload

  const structlogsArrayBuffer = yield* call(fetchStructlogs, s3Location)
  const structLogs = parseStructlogs(structlogsArrayBuffer)

  yield* put(structLogsActions.loadStructLogs(structLogs))
}
