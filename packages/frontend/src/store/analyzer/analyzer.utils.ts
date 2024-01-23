import { v4 as createUUID } from 'uuid'

import { infoApiGatewayUrl } from '../../config'

import { LogMessageStatus } from './analyzer.const'
import type { TLogMessageRecord } from './analyzer.types'

export const sendStatusMessageToDiscord = (message: string): Promise<Response> => {
  // eslint-disable-next-line import/exports-last
  const isMessageOff = document.cookie.replace(/(?:(?:^|.*;\s*)disable_info\s*=\s*([^;]*).*$)|^.*$/, '$1') === 'true'
  return !isMessageOff ? fetch(`${infoApiGatewayUrl}/info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: message,
    }),
  }) : 
}

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
