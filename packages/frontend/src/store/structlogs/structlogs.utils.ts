import type { IStructLog } from '@evm-debuger/types'
import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'

import { extendStack } from '../../helpers/helpers'
import { argStackExtractor } from '../../helpers/argStackExtractor'
import type { TMainTraceLogsWithId } from '../traceLogs/traceLogs.types'

export const parseStructlogs = (structLogs: IStructLog[], traceLogs: TMainTraceLogsWithId[]) => {
  return structLogs.map((item) => {
    if (checkIfOfCallType(item) || checkIfOfCreateType(item))
      return {
        ...argStackExtractor(item),
        stack: extendStack(item.stack),
        gasCost: traceLogs.find((traceLog) => traceLog.pc === item.pc)?.gasCost,
      }

    return {
      ...argStackExtractor(item),
      stack: extendStack(item.stack),
    }
  })
}
