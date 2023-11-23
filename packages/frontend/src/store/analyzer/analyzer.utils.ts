import { v4 as createUUID } from 'uuid'

import { LogMessageStatus } from './analyzer.const'
import type { TLogMessageRecord } from './analyzer.types'

export const createSuccessLogMessage = (message: string, _identifier?: string, _timestamp?: number): TLogMessageRecord => {
  const timestamp = _timestamp || Date.now()
  const identifier = _identifier || createUUID()
  return { timestamp, status: LogMessageStatus.SUCCESS, message, identifier }
}

export const createInfoLogMessage = (message: string, _identifier?: string, _timestamp?: number): TLogMessageRecord => {
  const timestamp = _timestamp || Date.now()
  const identifier = _identifier || createUUID()
  return { timestamp, status: LogMessageStatus.INFO, message, identifier }
}

export const createErrorLogMessage = (message: string, _identifier?: string, _timestamp?: number): TLogMessageRecord => {
  const timestamp = _timestamp || Date.now()
  const identifier = _identifier || createUUID()
  return { timestamp, status: LogMessageStatus.ERROR, message, identifier }
}

export const createWarningLogMessage = (message: string, _identifier?: string, _timestamp?: number): TLogMessageRecord => {
  const timestamp = _timestamp || Date.now()
  const identifier = _identifier || createUUID()
  return { timestamp, status: LogMessageStatus.WARNING, message, identifier }
}

export const createMockedLogMessages = (count: number): TLogMessageRecord[] => {
  return Array.from({ length: count }, (_, index) => createInfoLogMessage(`Message ${index}`))
}
