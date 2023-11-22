import { v4 as createUUID } from 'uuid'

import { createCallIdentifier } from '../../helpers/helpers'

import type { TMainTraceLogsWithId } from './traceLogs.types'

export const createMockedTraceLog = (stackCount?: number): TMainTraceLogsWithId => {
  const stackTrace = Array.from({ length: stackCount || 0 }, (_, index) => index)

  return {
    value: 'some value',
    type: 'CALL',
    startIndex: 0,
    stackTrace,
    pc: 0,
    passedGas: 0,
    output: 'some output',
    input: 'some input',
    index: 0,
    id: createCallIdentifier(stackTrace, 'CALL'),
    gasCost: 0,
    events: [],
    depth: 0,
    address: 'some address',
  }
}

export const createMockedTracelogs = (count: number): TMainTraceLogsWithId[] => {
  return Array.from({ length: count }, (_, index) => createMockedTraceLog(index))
}
