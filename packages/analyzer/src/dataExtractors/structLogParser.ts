import type {
  ICallTypeTraceLog,
  ICreateTypeTraceLog,
  ITraceLog,
  IReturnTypeTraceLog,
  IStopTypeTraceLog,
  TCallTypeArgs,
  TCreateTypeArgs,
  TReturnTypeArgs,
  ICallTypeStructLogs,
  ICreateTypeStructLogs,
  IFilteredStructLog,
  IReturnTypeStructLogs,
  IStructLog,
} from '@evm-debuger/types'

import { checkIfOfDelegateCallType, getNextItemOnSameDepth, getSafeHex } from '../helpers/helpers'
import type { StackCounter } from '../helpers/stackCounter'

import { extractArgsFromStack, extractCallTypeArgsData, extractCreateTypeArgsData, extractReturnTypeArgsData } from './argsExtractors'

export class StructLogParser {
  constructor(
    private readonly filteredStructLog: IFilteredStructLog,
    private readonly structLogs: IStructLog[],
    private readonly stackCounter: StackCounter,
  ) {}

  private extractDefaultData() {
    const { depth, gas, gasCost, op, pc, index } = this.filteredStructLog

    return { type: op, pc, passedGas: gas, index, gasCost, depth } as ITraceLog
  }

  private createStackTrace(depth: number, address: string): number[] {
    return this.stackCounter.visitDepth(depth, address)
  }

  public parseStopStructLog() {
    return { ...this.extractDefaultData() } as IStopTypeTraceLog
  }

  public parseCallStructLog() {
    const { depth, memory, index, op, stack, gas } = this.filteredStructLog as ICallTypeStructLogs

    const opCodeArguments = extractArgsFromStack(stack, op) as TCallTypeArgs
    const callTypeArgsData = extractCallTypeArgsData(opCodeArguments, memory)
    const nextStructLog = this.structLogs[index + 1]

    const storageAddress = checkIfOfDelegateCallType(this.filteredStructLog)
      ? this.stackCounter.getParentStorageAddress(depth)
      : callTypeArgsData.address

    const stackTrace = this.createStackTrace(depth, storageAddress)

    return {
      ...callTypeArgsData,
      ...this.extractDefaultData(),
      storageAddress,
      startIndex: index + 1,
      stackTrace,
      passedGas: nextStructLog.depth === depth ? gas : nextStructLog.gas,
    } as ICallTypeTraceLog
  }

  public parseCreateStructLog() {
    const { depth, memory, index, stack, op } = this.filteredStructLog as ICreateTypeStructLogs

    const opCodeArguments = extractArgsFromStack(stack, op) as TCreateTypeArgs
    const contractAddress = getSafeHex(getNextItemOnSameDepth(this.structLogs, index, depth).stack.at(-1).slice(-40))

    return {
      ...extractCreateTypeArgsData(opCodeArguments, memory),
      ...this.extractDefaultData(),
      storageAddress: contractAddress,
      startIndex: index + 1,
      stackTrace: this.createStackTrace(depth, contractAddress),
      passedGas: this.structLogs[index + 1].gas,
      address: contractAddress,
    } as ICreateTypeTraceLog
  }

  public parseReturnStructLog() {
    const { memory, stack, op } = this.filteredStructLog as IReturnTypeStructLogs

    const opCodeArguments = extractArgsFromStack(stack, op) as TReturnTypeArgs

    return {
      ...extractReturnTypeArgsData(opCodeArguments, memory),
      ...this.extractDefaultData(),
    } as IReturnTypeTraceLog
  }
}
