import type { TIndexedStructLog, TTraceLog, TTraceReturnLog, TTraceLogBase, TTraceLogData } from '@evm-debuger/types'

import { getNextItemOnSameDepth, getSafeHex } from '../helpers/helpers'
import { checkOpcodeIfOfDelegateCallType } from '../helpers/structLogTypeGuards'
import {
  getCallGroupOpcodesArgumentsData,
  getCreateGroupOpcodesArgumentsData,
  getReturnGroupTypeOpcodesArgumentsData,
} from '../helpers/structlogArgumentsExtractors'

import type { StackCounter } from './stackCounter'

export class StructLogParser {
  constructor(private readonly structLogs: TIndexedStructLog[], private readonly stackCounter: StackCounter) {}

  private createStackTrace(depth: number, address: string): number[] {
    return this.stackCounter.visitDepth(depth, address)
  }

  private extractDefaultData(structLog: TIndexedStructLog): TTraceLogBase {
    const { depth, gas, gasCost, op, pc, index } = structLog

    return { pc, passedGas: gas, op, index, gasCost, depth }
  }

  private getCallTypeData(structLog: TIndexedStructLog): Pick<TTraceLog, keyof TTraceLogData | 'callTypeData'> {
    const { depth, op, index, gas } = structLog
    const { address, input, output, value } = getCallGroupOpcodesArgumentsData(structLog)
    const nextStructLog = this.structLogs[index + 1]

    const storageAddress = checkOpcodeIfOfDelegateCallType(op) ? this.stackCounter.getParentStorageAddress(depth) : address

    const stackTrace = this.createStackTrace(depth, storageAddress)

    return {
      value,
      storageAddress,
      startIndex: index + 1,
      stackTrace,
      passedGas: nextStructLog.depth === depth ? gas : nextStructLog.gas,
      input,
      callTypeData: { output, events: [] },
      address,
    }
  }

  private getCreateTypeData(structLog: TIndexedStructLog): Pick<TTraceLog, keyof TTraceLogData | 'createTypeData'> {
    const { depth, index } = structLog
    const { input, value, ...restArguments } = getCreateGroupOpcodesArgumentsData(structLog)
    const contractAddress = getSafeHex(getNextItemOnSameDepth(this.structLogs, index, depth).stack.at(-1).slice(-40))

    return {
      value,
      storageAddress: contractAddress,
      startIndex: index + 1,
      stackTrace: this.createStackTrace(depth, contractAddress),
      passedGas: this.structLogs[index + 1].gas,
      input,
      createTypeData: 'salt' in restArguments ? { salt: restArguments.salt } : undefined,
      address: contractAddress,
    }
  }

  private getTraceReturnLogData(structLog: TIndexedStructLog): TTraceReturnLog['output'] {
    const argumentsData = getReturnGroupTypeOpcodesArgumentsData(structLog)

    return argumentsData.output
  }

  public parseStructLogToTraceLog(structLog: TIndexedStructLog): TTraceLog {
    const traceLogBaseData = this.extractDefaultData(structLog)
    const traceLogCallTypeData = this.getCallTypeData(structLog)
    const traceLogCreateTypeData = this.getCreateTypeData(structLog)

    return { ...traceLogBaseData, ...traceLogCreateTypeData, ...traceLogCallTypeData }
  }
  public parseStructLogToTraceReturnLog(structLog: TIndexedStructLog): TTraceReturnLog {
    const traceLogBaseData = this.extractDefaultData(structLog)
    const output: TTraceReturnLog['output'] = this.getTraceReturnLogData(structLog)

    return { ...traceLogBaseData, output }
  }
}
