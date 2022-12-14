import type {
  ICallTypeTraceLog,
  IFilteredStructLog,
  TEventInfo,
  TMainTraceLogs,
  TReturnedTraceLog,
  TTransactionData,
} from '@evm-debuger/types'

import {
  checkIfOfCallType,
  checkIfOfCreateOrCallType,
  checkIfOfCreateType,
  checkIfOfReturnType,
  convertTxInfoToTraceLog,
  getFilteredStructLogs,
  getLastItemInCallTypeContext,
  getLastLogWithRevertType,
  getSafeHex,
  isLogType,
  prepareTraceToSearch,
  readMemory,
} from './helpers/helpers'
import { StructLogParser } from './dataExtractors/structLogParser'
import { StackCounter } from './helpers/stackCounter'
import { StorageHandler } from './dataExtractors/storageHandler'
import { FragmentReader } from './helpers/fragmentReader'
import { extractLogTypeArgsData } from './dataExtractors/argsExtractors'
import { SigHashStatuses } from './sigHashes'
import fetch from "node-fetch"

export class TxAnalyzer {
  constructor(public readonly transactionData: TTransactionData) {}

  private readonly storageHandler = new StorageHandler()
  private readonly stackCounter = new StackCounter()
  private fragmentReader: FragmentReader

  private getParsedTraceLogs(filteredStructLogs: IFilteredStructLog[]): TReturnedTraceLog[] {
    return filteredStructLogs.map((item) => {
      const structLogParser = new StructLogParser(item, this.transactionData.structLogs, this.stackCounter)

      // CALL | CALLCODE | DELEGATECALL | STATICCALL
      if (checkIfOfCallType(item)) return structLogParser.parseCallStructLog()

      // CREATE | CREATE2
      if (checkIfOfCreateType(item)) return structLogParser.parseCreateStructLog()

      // REVERT AND RETURN
      if (checkIfOfReturnType(item)) return structLogParser.parseReturnStructLog()

      // STOP
      if (item.op === 'STOP') return structLogParser.parseStopStructLog()
    })
  }

  private parseAndAddRootTraceLog(transactionList: TReturnedTraceLog[]) {
    const rootTraceLog = convertTxInfoToTraceLog(this.transactionData.structLogs[0], this.transactionData.transactionInfo)
    return [rootTraceLog, ...transactionList]
  }

  private returnTransactionListWithContractFlag(traceLogs: TReturnedTraceLog[]) {
    return traceLogs.map((item) => {
      if (checkIfOfCallType(item)) {
        const { index, depth } = item
        const nextStructLog = this.transactionData.structLogs[index + 1]

        if (nextStructLog.depth === depth + 1) {
          return { ...item, isContract: true }
        }
      }
      return item
    })
  }

  private combineCallWithItsReturn(traceLogs: TReturnedTraceLog[]) {
    return traceLogs.map((item, rootIndex) => {
      if (checkIfOfCallType(item) || checkIfOfCreateType(item)) {
        if (checkIfOfCallType(item) && !item.isContract) {
          return { ...item, gasCost: item.passedGas - this.transactionData.structLogs[item.index + 1].gas }
        }

        const lastItemInCallContext = getLastItemInCallTypeContext(traceLogs, rootIndex, item.depth)

        if (!lastItemInCallContext) return { ...item, isSuccess: false }

        const { index, passedGas } = lastItemInCallContext
        const gasCost = item.passedGas - passedGas

        if (lastItemInCallContext.type === 'RETURN' || lastItemInCallContext.type === 'REVERT') {
          const { output } = lastItemInCallContext
          const isSuccess = lastItemInCallContext.type === 'RETURN'
          const isReverted = lastItemInCallContext.type === 'REVERT'
          return { ...item, returnIndex: index, output, isSuccess, isReverted, gasCost }
        }
        return { ...item, returnIndex: index, isSuccess: true, gasCost }
      }
      return item
    })
  }

  private markLogEntryAsFailureIfParentReverted(traceLogs: TReturnedTraceLog[]) {
    const logIndexesToMarkAsFailure = new Set()
    traceLogs.map((item, rootIndex) => {
      if (checkIfOfCallType(item) || checkIfOfCreateType(item)) {

        const childrenLogs = prepareTraceToSearch(traceLogs, rootIndex, item.depth, false) as TReturnedTraceLog[]
        const lastItemWithRevertType = getLastLogWithRevertType(childrenLogs, item.depth)
        if (lastItemWithRevertType) childrenLogs.forEach(log => logIndexesToMarkAsFailure.add(log.index))
      }
    })

    return traceLogs.map(log => {
      if (logIndexesToMarkAsFailure.has(log.index)) return { ...log, isSuccess: false }
      else return log
    })
  }

  private decodeCallInputOutput(mainTraceLogList: TMainTraceLogs[]) {
    const abis = this.transactionData.abis

    Object.keys(abis).forEach((address) => {
      this.fragmentReader.loadFragmentsFromAbi(abis[address])
    })

    return mainTraceLogList.map((item) => {
      if (checkIfOfCallType(item) && item.isContract && item.input) {
        const result = this.fragmentReader.decodeFragment(item.isReverted, item.input, item.output)

        return { ...item, ...result }
      }
      return item
    })
  }

  private extendWithLogsData(mainTraceLogList: TMainTraceLogs[]) {
    mainTraceLogList.forEach((item, index) => {
      if (checkIfOfCallType(item) && item.isContract && item.isSuccess) {
        const events: TEventInfo[] = []

        const { startIndex, returnIndex, depth } = item

        const callStructLogContext = [...this.transactionData.structLogs]
          .slice(startIndex, returnIndex)
          .filter((element) => element.depth === depth + 1)

        const logTypeStructLogs = callStructLogContext.filter(isLogType)

        logTypeStructLogs.forEach((logTypeStructLog) => {
          const { memory } = logTypeStructLog
          const { logDataLength, logDataOffset, topics } = extractLogTypeArgsData(logTypeStructLog)

          const logData = getSafeHex(readMemory(memory, logDataOffset, logDataLength))

          const eventResult = this.fragmentReader.decodeEvent(logData, topics)

          events.push(eventResult)
        })
        mainTraceLogList[index] = { ...item, events }
      }
    })

    return mainTraceLogList
  }

  private extendWithStorageData(transactionList: TMainTraceLogs[]) {
    for (let index = 0; index < transactionList.length; index++) {
      const traceLog = transactionList[index]

      if (checkIfOfCallType(traceLog) && traceLog.isContract) {
        const storageLogs = this.storageHandler.getParsedStorageLogs(traceLog, this.transactionData.structLogs)
        const storageAddress = this.storageHandler.resolveStorageAddress(
          traceLog,
          transactionList[index - 1] as ICallTypeTraceLog,
          this.transactionData.structLogs
        )

        transactionList[index] = { ...traceLog, storageLogs, storageAddress }
      }
    }

    return transactionList
  }

  private getTraceLogsContractAddresses(transactionList: TMainTraceLogs[]): string[] {
    const contractAddressList = []
    transactionList.forEach((item) => {
      if (checkIfOfCallType(item) && item.isContract && !contractAddressList.includes(item.address)) {
        contractAddressList.push(item.address)
      }
    })

    return contractAddressList
  }

  private extendWithBlockNumber(transactionList: TMainTraceLogs[]) {
    return transactionList.map((item) => ({ ...item, blockNumber: this.transactionData.transactionInfo.blockNumber }))
  }

  private getCallAndCreateType = (transactionList: TReturnedTraceLog[]): TMainTraceLogs[] => {
    return transactionList.filter(checkIfOfCreateOrCallType)
  }

  private getContractSighashList(mainTraceLogList: TMainTraceLogs[]) {
    const sighashStatues = new SigHashStatuses()
    mainTraceLogList.forEach((item) => {
      if (checkIfOfCallType(item) && item.isContract && item.input) {
        const { input, address, errorDescription, functionDescription } = item
        const sighash = input.slice(0, 10)

        if (functionDescription !== null) sighashStatues.add(address, sighash, functionDescription)
        else sighashStatues.add(address, sighash, null)

        if (errorDescription !== null) sighashStatues.add(address, sighash, errorDescription)
        else sighashStatues.add(address, sighash, null)
      }
    })

    return sighashStatues.sighashStatusList
  }

  private getContractAddressesInTransaction() {
    const baseStructLogs = getFilteredStructLogs(this.transactionData.structLogs)
    const parsedTraceLogs = this.getParsedTraceLogs(baseStructLogs)
    const traceLogsList = this.parseAndAddRootTraceLog(parsedTraceLogs)
    const traceLogsListWithContractFlag = this.returnTransactionListWithContractFlag(traceLogsList)
    const mainTraceLogList = this.getCallAndCreateType(traceLogsListWithContractFlag)

    return this.getTraceLogsContractAddresses(mainTraceLogList)
  }

  public async enrichTransactionDataWithTranslatedAddresses() {
    const addresses = this.getContractAddressesInTransaction()
    for (const address of addresses) {
      const response = await fetch(
          `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=Y8XNE3W519FITZJRPRGYY4ZEII2IV3W73F`
      )

      const {result, status} = await response.json()
      if (status === '1') {
        this.transactionData.abis[address] = result
      }
    }
  }

  public analyze() {
    this.fragmentReader = new FragmentReader()
    const baseStructLogs = getFilteredStructLogs(this.transactionData.structLogs)
    const parsedTraceLogs = this.getParsedTraceLogs(baseStructLogs)
    const traceLogsList = this.parseAndAddRootTraceLog(parsedTraceLogs)
    const traceLogsListWithContractFlag = this.returnTransactionListWithContractFlag(traceLogsList)
    const traceLogsListWithReturnData = this.combineCallWithItsReturn(traceLogsListWithContractFlag)
    const traceLogsListWithSuccessFlag = this.markLogEntryAsFailureIfParentReverted(traceLogsListWithReturnData)
    let mainTraceLogList = this.getCallAndCreateType(traceLogsListWithSuccessFlag)

    mainTraceLogList = this.decodeCallInputOutput(mainTraceLogList)
    mainTraceLogList = this.extendWithStorageData(mainTraceLogList)
    mainTraceLogList = this.extendWithLogsData(mainTraceLogList)
    mainTraceLogList = this.extendWithBlockNumber(mainTraceLogList)

    const contractAddresses = this.getTraceLogsContractAddresses(mainTraceLogList)
    const contractSighashesInfo = this.getContractSighashList(mainTraceLogList)

    return { mainTraceLogList, analyzeSummary: { contractAddresses, contractSighashesInfo } }
  }
}
