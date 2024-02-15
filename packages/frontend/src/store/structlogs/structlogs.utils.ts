import { checkOpcodeIfOfCallOrCreateGroupType } from '@evm-debuger/analyzer'
import type { TIndexedStructLog } from '@evm-debuger/types'

import { extendStack } from '../../helpers/helpers'
import { argStackExtractor } from '../../helpers/argStackExtractor'
import type { TMainTraceLogsWithId } from '../traceLogs/traceLogs.types'

export const parseStructlogs = (structLogs: TIndexedStructLog[], traceLogs: TMainTraceLogsWithId[]) => {
  return structLogs.map((item) => {
    if (checkOpcodeIfOfCallOrCreateGroupType(item.op))
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
