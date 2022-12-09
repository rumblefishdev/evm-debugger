import type {
  ICallTypeTraceLog,
  IContractAddress,
  IFilteredStructLog,
  TEventInfo,
  TMainTraceLogs,
  TReturnedTraceLog,
  TTransactionData,
} from '@evm-debuger/types'

import {
  checkIfOfCallType,
  checkIfOfCreateType,
  checkIfOfReturnType,
  convertTxInfoToTraceLog,
  getBaseStructLogs,
  getCallAndCreateType,
  getLastItemInCallTypeContext,
  getSafeHex,
  isLogType,
  readMemory,
} from './helpers/helpers'
import {StructLogParser} from './dataExtractors/structLogParser'
import {StackCounter} from './helpers/stackCounter'
import {StorageHandler} from './dataExtractors/storageHandler'
import {FragmentReader} from './helpers/fragmentReader'
import {extractLogTypeArgsData} from './dataExtractors/argsExtractors'

export class TxAnalyzer {
  constructor(private readonly transactionData: TTransactionData) {}

  private readonly storageHandler = new StorageHandler()
  private readonly stackCounter = new StackCounter()
  private readonly fragmentReader = new FragmentReader()

  private filteredStructLogs: IFilteredStructLog[]
  private parsedTransactionList: TReturnedTraceLog[]
  private contractAddressesLists: IContractAddress[] = []

  private getStructLogs() {
    this.filteredStructLogs = getBaseStructLogs(this.transactionData.structLogs)
  }

  private parseStructLogs() {
    return this.filteredStructLogs.map((item) => {
      const structLogParser = new StructLogParser(item, this.transactionData.structLogs, this.stackCounter)

      // CALL | CALLCODE | DELEGATECALL | STATICCALL
      if (checkIfOfCallType(item)) return structLogParser.parseCallStructLog()

      // CREATE | CREATE2
      if (checkIfOfCreateType(item)) return structLogParser.parseCreateStructLog()

      // REVERT AND RETURN
      if (checkIfOfReturnType(item)) return structLogParser.parseReturnStructLog()

      // STOP
      if (item.op === 'STOP') return structLogParser.parseStopStructLog()
    }) as TReturnedTraceLog[]
  }

  private parseAndAddRootTraceLog() {
    const rootTraceLog = convertTxInfoToTraceLog(this.transactionData.structLogs[0], this.transactionData.transactionInfo)
    const { blockNumber } = rootTraceLog

    this.parsedTransactionList.unshift(rootTraceLog)

    return this.parsedTransactionList.map((item) => {
      if (checkIfOfCallType(item) || checkIfOfCreateType(item)) return { ...item, blockNumber } as TReturnedTraceLog

      return item
    })
  }
  private returnTransactionListWithContractFlag() {
    return this.parsedTransactionList.map((item) => {
      if (checkIfOfCallType(item)) {
        const { index, depth, address } = item
        const nextStructLog = this.transactionData.structLogs[index + 1]

        if (nextStructLog.depth === depth + 1) {
          if (!this.contractAddressesLists.includes({ index, address })) this.contractAddressesLists.push({ index, address })

          return { ...item, isContract: true }
        }
      }

      return item
    })
  }
  private combineCallWithItsReturn() {
    return this.parsedTransactionList.map((item, rootIndex) => {
      if (checkIfOfCallType(item) || checkIfOfCreateType(item)) {
        if (checkIfOfCallType(item) && !item.isContract) {
          return { ...item, gasCost: item.passedGas - this.transactionData.structLogs[item.index + 1].gas }
        }

        const lastItemInCallContext = getLastItemInCallTypeContext(this.parsedTransactionList, rootIndex, item.depth)

        if (!lastItemInCallContext) return { ...item, isSuccess: false }

        const { index, passedGas } = lastItemInCallContext
        const gasCost = item.passedGas - passedGas

        if (lastItemInCallContext.type === 'RETURN' || lastItemInCallContext.type === 'REVERT') {
          const { output } = lastItemInCallContext
          const isSuccess = lastItemInCallContext.type === 'RETURN'
          return { ...item, returnIndex: index, output, isSuccess, gasCost }
        }
        return { ...item, returnIndex: index, isSuccess: true, gasCost }
      }
      return item
    })
  }

  private decodeCallInputOutput() {
    const abis = this.transactionData.abis || {}

    Object.keys(abis).forEach((address) => {
      this.fragmentReader.loadFragmentsFromAbi(abis[address])
    })

    this.parsedTransactionList.forEach((item, index) => {
      if (checkIfOfCallType(item) && item.isContract && item.input) {
        const { decodedInput, decodedOutput, functionDescription, errorDescription } = this.fragmentReader.decodeFragment(
          item.isSuccess,
          item.input,
          item.output
        )

        this.parsedTransactionList[index] = {
          ...item,
          functionDescription,
          errorDescription,
          decodedOutput,
          decodedInput,
        }
      }
    })
  }

  private parseLogsData(parseTxWithStorageData: TReturnedTraceLog[]) {
    parseTxWithStorageData.forEach((item, index) => {
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
        parseTxWithStorageData[index] = { ...item, events }
      }
    })

    return parseTxWithStorageData
  }

  private parseStorageData(transactionList: TReturnedTraceLog[]) {
    for (let index = 0; index < transactionList.length; index++) {
      const traceLog = transactionList[index]

      if ((checkIfOfCallType(traceLog) && traceLog.isContract) || checkIfOfCreateType(traceLog)) {
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

  public analyze() {
    this.getStructLogs()
    this.parsedTransactionList = this.parseStructLogs()
    this.parsedTransactionList = this.parseAndAddRootTraceLog()
    this.parsedTransactionList = this.returnTransactionListWithContractFlag()
    this.parsedTransactionList = this.combineCallWithItsReturn()
    this.decodeCallInputOutput()
    this.parsedTransactionList = getCallAndCreateType(this.parsedTransactionList)
    const parseTxWithStorageData = this.parseStorageData(this.parsedTransactionList)
    const parseTxWithLogsData = this.parseLogsData(parseTxWithStorageData)

    return parseTxWithLogsData as TMainTraceLogs[]
  }
}
