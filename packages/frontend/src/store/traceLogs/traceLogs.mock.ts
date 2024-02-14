import { createCallIdentifier } from '../../helpers/helpers'

import type { TMainTraceLogsWithId } from './traceLogs.types'

export const createMockedTraceLog = (stackCount?: number): TMainTraceLogsWithId => {
  const stackTrace = Array.from({ length: stackCount || 0 }, (_, index) => index)

  return {
    value: 'some value',
    startIndex: 0,
    stackTrace,
    pc: 0,
    passedGas: 0,
    output: 'some output',
    op: 'CALL',
    input: 'some input',
    index: 0,
    id: createCallIdentifier(stackTrace, 'CALL'),
    gasCost: 0,
    depth: 0,
    callTypeData: { events: [] },
    address: 'some address',
  }
}

export const createMockedTracelogs = (count: number): TMainTraceLogsWithId[] => {
  return Array.from({ length: count }, (_, index) => createMockedTraceLog(index))
}
