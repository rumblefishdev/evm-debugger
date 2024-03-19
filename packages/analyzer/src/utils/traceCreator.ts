import { BaseOpcodesHex } from '@evm-debuger/types'
import type { TIndexedStructLog, TTraceReturnLog, TEventInfo, TTraceLog } from '@evm-debuger/types'
import { toBigInt } from 'ethers'

import {
  convertTxInfoToTraceLog,
  getFunctionBlockEndStructLogs,
  getFunctionBlockStartStructLogs,
  getSafeHex,
  getStorageAddressFromTransactionInfo,
  readMemory,
  selectFunctionBlockContextForLog,
  selectLastStructLogInFunctionBlockContext,
} from '../helpers/helpers'
import { checkOpcodeIfOfCallGroupType, checkOpcodeIfOfLogGroupType, checkOpcodeIfOfReturnGroupType } from '../helpers/structLogTypeGuards'
import { SigHashStatuses } from '../sigHashes'
import { getLogGroupTypeOpcodesArgumentsData } from '../helpers/structlogArgumentsExtractors'
import { createErrorDescription } from '../resources/builtinErrors'

import type { DataLoader } from './dataLoader'
import { FragmentReader } from './fragmentReader'
import { StackCounter } from './stackCounter'
import { StorageHandler } from './storageHandler'
import { OpCodeConverter } from './structLogParser'

export class TraceCreator {
  private readonly storageHandler: StorageHandler = new StorageHandler()
  private readonly stackCounter: StackCounter = new StackCounter()
  private fragmentReader: FragmentReader
  private readonly dataLoader: DataLoader

  constructor(dataLoader: DataLoader) {
    this.dataLoader = dataLoader
  }

  private convertToTraceLog(structLog: TIndexedStructLog[]): TTraceLog[] {
    const structLogParser = new OpCodeConverter(this.dataLoader.inputStructlogs.get(), this.stackCounter)
    return structLog.map((item) => structLogParser.parseStructLogToTraceLog(item))
  }

  private convertToTraceReturnLog(structLog: TIndexedStructLog[]): TTraceReturnLog[] {
    const structLogParser = new OpCodeConverter(this.dataLoader.inputStructlogs.get(), this.stackCounter)
    return structLog.map((item) => structLogParser.parseStructLogToTraceReturnLog(item))
  }

  private parseAndAddRootTraceLog(transactionList: TTraceLog[]) {
    const rootTraceLog = convertTxInfoToTraceLog(this.dataLoader.inputStructlogs.get()[0], this.dataLoader.inputTransactionData.get())
    return [rootTraceLog, ...transactionList]
  }

  private combineCallWithItsReturn(traceLogs: TTraceLog[], traceReturnLogs: TTraceReturnLog[]): TTraceLog[] {
    return traceLogs.map((traceLog) => {
      if (!traceLog.isContract) {
        const result = {
          ...traceLog,
          returnIndex: traceLog.startIndex,
          gasCost: traceLog.passedGas - this.dataLoader.inputStructlogs.get()[traceLog.index + 1].gas,
        }
        if (traceLog.input === '0x') result.isSuccess = true
        return result
      }

      const lastItemInCallContext = selectLastStructLogInFunctionBlockContext(this.dataLoader.inputStructlogs.get(), traceLog)

      const lastItemInTraceReturnLogs = traceReturnLogs.find((item) => item.index === lastItemInCallContext.index)

      if (!lastItemInTraceReturnLogs && traceLog.gasCost > traceLog.passedGas) {
        return {
          ...traceLog,
          isSuccess: false,
          isReverted: true,
          callTypeData: { ...traceLog.callTypeData, errorDescription: createErrorDescription('OUT_OF_GAS') },
        }
      }
      if (!lastItemInTraceReturnLogs) return { ...traceLog, isSuccess: false }

      const { index, passedGas } = lastItemInTraceReturnLogs
      const gasCost = traceLog.passedGas - passedGas

      if (checkOpcodeIfOfReturnGroupType(lastItemInCallContext.op)) {
        const { output } = lastItemInTraceReturnLogs
        const isSuccess = BaseOpcodesHex[lastItemInCallContext.op] === BaseOpcodesHex.RETURN
        const isReverted = BaseOpcodesHex[lastItemInCallContext.op] === BaseOpcodesHex.REVERT
        return {
          ...traceLog,
          returnIndex: index,
          output,
          isSuccess,
          isReverted,
          gasCost,
          callTypeData: { ...traceLog.callTypeData },
        }
      }
      return { ...traceLog, returnIndex: index, isSuccess: true, gasCost }
    })
  }

  private markLogEntryAsFailureIfParentReverted(traceLogs: TTraceLog[]) {
    const logIndexesToMarkAsFailure = new Set()
    for (const traceLog of traceLogs) {
      const childrenLogs = selectFunctionBlockContextForLog(traceLogs, traceLog)
      if (traceLog.isReverted) childrenLogs.forEach((log) => logIndexesToMarkAsFailure.add(log.index))
    }

    return traceLogs.map((log) => {
      return logIndexesToMarkAsFailure.has(log.index) ? { ...log, isSuccess: false } : log
    })
  }

  private decodeCallInputOutput(mainTraceLogList: TTraceLog[]): TTraceLog[] {
    return mainTraceLogList.map((item) => {
      if (checkOpcodeIfOfCallGroupType(item.op) && item.isContract && item.input) {
        const { decodedInput, decodedOutput, errorDescription, functionFragment } = this.fragmentReader.decodeFragment(
          item.isReverted,
          item.input,
          item.output,
        )

        return {
          ...item,
          callTypeData: {
            ...item.callTypeData,
            functionFragment,
            errorDescription: item.callTypeData.errorDescription || errorDescription,
            decodedOutput,
            decodedInput,
          },
        }
      }
      return item
    })
  }

  private extendWithLogsData(mainTraceLogList: TTraceLog[]) {
    mainTraceLogList.forEach((item, index) => {
      if (checkOpcodeIfOfCallGroupType(item.op) && item.isContract) {
        const events: TEventInfo[] = []
        if (item.isSuccess) {
          const { startIndex, returnIndex, depth } = item

          const callStructLogContext = [...this.dataLoader.inputStructlogs.get()]
            .slice(startIndex, returnIndex)
            .filter((element) => element.depth === depth + 1)

          const logTypeStructLogs = callStructLogContext.filter((log) => checkOpcodeIfOfLogGroupType(log.op))

          logTypeStructLogs.forEach((logTypeStructLog) => {
            const { logDataLength, logDataOffset, topics } = getLogGroupTypeOpcodesArgumentsData(logTypeStructLog)

            const logData = getSafeHex(readMemory(logTypeStructLog.memory, logDataOffset, logDataLength))

            const eventResult = this.fragmentReader.decodeEvent(logData, topics)
            events.push(eventResult)
          })
        }
        mainTraceLogList[index] = { ...item, callTypeData: { ...item.callTypeData, events } }
      }
    })

    return mainTraceLogList
  }

  private extendWithStorageData(transactionList: TTraceLog[]) {
    for (let index = 0; index < transactionList.length; index++) {
      const traceLog = transactionList[index]

      if (traceLog.isContract) {
        const storageLogs = this.storageHandler.getParsedStorageLogs(traceLog, this.dataLoader.inputStructlogs.get())
        transactionList[index] = { ...traceLog, storageLogs }
      }
    }

    return transactionList
  }

  private extendWithBlockNumber(transactionList: TTraceLog[]) {
    return transactionList.map((item) => ({
      ...item,
      blockNumber: toBigInt(this.dataLoader.inputTransactionData.get().blockNumber).toString(),
    }))
  }

  private loadContractsAbis() {
    const contractsAbis = this.dataLoader.inputContractData.getAll('applicationBinaryInterface')
    for (const contractAbi of Object.values(contractsAbis)) {
      if (contractAbi) this.fragmentReader.loadFragmentsFromAbi(contractAbi)
    }
  }

  private createContractSighashList() {
    const traceLogs = this.dataLoader.analyzerTraceLogs.get()

    const sighashStatues = new SigHashStatuses()
    for (const traceLog of traceLogs)
      if (
        checkOpcodeIfOfCallGroupType(traceLog.op) &&
        traceLog.isContract &&
        traceLog.input &&
        traceLog.input !== '0x' // this is pure transfer of ETH
      ) {
        const { input, address, callTypeData } = traceLog
        const { functionFragment, errorDescription } = callTypeData
        const sighash = input.slice(0, 10)

        if (functionFragment) sighashStatues.add(address, sighash, JSON.parse(functionFragment.format('json')))
        else sighashStatues.add(address, sighash, null)

        if (errorDescription && errorDescription.fragment)
          sighashStatues.add(address, sighash, {
            type: errorDescription.fragment.type,
            name: errorDescription.fragment.name,
            inputs: errorDescription.fragment.inputs,
          })
        else sighashStatues.add(address, sighash, null)
      }

    this.dataLoader.analyzerSighashes.set(
      sighashStatues.sighashStatusList.reduce((accumulator, item) => {
        accumulator[item.sighash] = item
        return accumulator
      }, {}),
    )
  }

  private getTraceLogsContractAddresses(transactionList: TTraceLog[]): string[] {
    const contractAddressList: string[] = []
    transactionList.forEach((item) => {
      if (checkOpcodeIfOfCallGroupType(item.op) && item.isContract && !contractAddressList.includes(item.address))
        contractAddressList.push(item.address)
    })

    return contractAddressList
  }

  public processTransactionStructLogs() {
    this.fragmentReader = new FragmentReader()

    if (this.dataLoader.inputStructlogs.get().length === 0) throw new Error(`Too primitive transaction without stack calls.`)

    this.loadContractsAbis()

    const storageAddress = getStorageAddressFromTransactionInfo(this.dataLoader.inputTransactionData.get())
    this.stackCounter.visitDepth(0, storageAddress)

    const functionBlockStartStructLogs = getFunctionBlockStartStructLogs(this.dataLoader.inputStructlogs.get())
    const functionBlockEndStructLogs = getFunctionBlockEndStructLogs(this.dataLoader.inputStructlogs.get())

    const traceLogs = this.convertToTraceLog(functionBlockStartStructLogs)
    const traceReturnLogs = this.convertToTraceReturnLog(functionBlockEndStructLogs)

    const traceLogsWithRoot = this.parseAndAddRootTraceLog(traceLogs)

    const traceLogsListWithReturnData = this.combineCallWithItsReturn(traceLogsWithRoot, traceReturnLogs)

    const traceLogsListWithSuccessFlag = this.markLogEntryAsFailureIfParentReverted(traceLogsListWithReturnData)

    const traceLogsWithDecodedIO = this.decodeCallInputOutput(traceLogsListWithSuccessFlag)
    const traceLogsWithStorageData = this.extendWithStorageData(traceLogsWithDecodedIO)
    const traceLogsWithLogsData = this.extendWithLogsData(traceLogsWithStorageData)
    const traceLogsWithBlockNumber = this.extendWithBlockNumber(traceLogsWithLogsData)

    this.dataLoader.analyzerTraceLogs.set(traceLogsWithBlockNumber)
    this.dataLoader.analyzerStructLogs.set(this.dataLoader.inputStructlogs.get())
    this.dataLoader.analyzerTransactionInfo.set(this.dataLoader.inputTransactionData.get())

    this.createContractSighashList()
  }

  public getContractAddressesInTransaction() {
    if (this.dataLoader.inputStructlogs.get().length === 0) throw new Error(`Too primitive transaction without stack calls.`)

    const storageAddress = getStorageAddressFromTransactionInfo(this.dataLoader.inputTransactionData.get())
    this.stackCounter.visitDepth(0, storageAddress)

    const functionBlockStartStructLogs = getFunctionBlockStartStructLogs(this.dataLoader.inputStructlogs.get())
    const traceLogs = this.convertToTraceLog(functionBlockStartStructLogs)
    const traceLogsList = this.parseAndAddRootTraceLog(traceLogs)

    return this.getTraceLogsContractAddresses(traceLogsList)
  }
}
