import type { PayloadAction } from '@reduxjs/toolkit'

import type { TLogMessageRecord } from '../store/analyzer/analyzer.types'

export const createLogMessageActionForTests = <T extends string>(action: PayloadAction<TLogMessageRecord, T>) => {
  const { timestamp, identifier, ...addLogExpectedActionPayload } = action.payload
  return {
    type: action.type,
    payload: addLogExpectedActionPayload,
  }
}
