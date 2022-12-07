import type {
  ICallTypeTraceLog,
  ICreateTypeTraceLog,
  IFilteredStructLog,
  IStructLog,
  TDataProvider,
  TReturnedTraceLog,
} from '@evm-debuger/types'

import {
  chceckIfOfCallType,
  checkIfOfCreateType,
  checkIfOfReturnType,
  convertTxInfoToTraceLog,
  getCallAndCreateType,
  getBaseStructLogs,
  getLastItemInCallTypeContext,
} from './helpers/helpers'
import { StructLogParser } from './dataExtractors/structLogParser'
import { StackCounter } from './helpers/stackCounter'
import { StorageHandler } from './dataExtractors/storageHandler'
import { AbiReader } from './helpers/abiReader'
import { FragmentReader } from './helpers/fragmentReader'

export class TxAnalyzer {
  constructor(private readonly dataProvider: TDataProvider, private readonly transactionHash: string) {}

  private readonly stackCounter = new StackCounter()
  private readonly abiReader = new AbiReader(this.dataProvider)
  private readonly fragmentReader = new FragmentReader()

  private structLogs: IStructLog[]
  private filteredStructLogs: IFilteredStructLog[]
  private parsedTransactionList: TReturnedTraceLog[]
  private contractAddressesLists: string[] = []

  private async getStructLogs() {
    const trace = await this.dataProvider.getTransactionTrace(this.transactionHash)
    const filteredStructLogs = getBaseStructLogs(trace.structLogs)

    this.structLogs = trace.structLogs
    this.filteredStructLogs = filteredStructLogs
  }

  private parseStructLogs() {
    return this.filteredStructLogs.map((item) => {
      const structLogParser = new StructLogParser(item, this.structLogs, this.stackCounter)

      // CALL | CALLCODE | DELEGATECALL | STATICCALL
      if (chceckIfOfCallType(item)) return structLogParser.parseCallStructLog()

      // CREATE | CREATE2
      if (checkIfOfCreateType(item)) return structLogParser.parseCreateStructLog()

      // REVERT AND RETURN
      if (checkIfOfReturnType(item)) return structLogParser.parseReturnStructLog()

      // STOP
      if (item.op === 'STOP') return structLogParser.parseStopStructLog()
    }) as TReturnedTraceLog[]
  }

  private async parseAndAddRootTraceLog() {
    const transactionInfo = await this.dataProvider.getTransactionByHash(this.transactionHash)

    const rootTraceLog = convertTxInfoToTraceLog(this.structLogs[0], transactionInfo)
    const { blockNumber } = rootTraceLog

    this.parsedTransactionList.unshift(rootTraceLog)

    return this.parsedTransactionList.map((item) => {
      if (chceckIfOfCallType(item) || checkIfOfCreateType(item)) return { ...item, blockNumber } as TReturnedTraceLog

      return item
    })
  }

  private checkIfCallPointsToContract() { //TODO wrong name ?
    return this.parsedTransactionList.map((item) => {
      if (chceckIfOfCallType(item)) {
        const { index, depth, address } = item
        const nextStructLog = this.structLogs[index + 1]

        if (nextStructLog.depth === depth + 1) {
          if (!this.contractAddressesLists.includes(address)) this.contractAddressesLists.push(address)

          return { ...item, isContract: true }
        }
      }

      return item
    })
  }

  private combineCallWithItsReturn() {
    return this.parsedTransactionList.map((item, rootIndex) => {
      if ((chceckIfOfCallType(item) && item.isContract) || checkIfOfCreateType(item)) {
        const lastItemInCallContext = getLastItemInCallTypeContext(this.parsedTransactionList, rootIndex, item.depth)

        if (!lastItemInCallContext) return { ...item, success: false }

        const { index, passedGas } = lastItemInCallContext
        const gasCost = item.passedGas - passedGas

        if (lastItemInCallContext.type === 'RETURN' || lastItemInCallContext.type === 'REVERT') {
          const { output } = lastItemInCallContext
          const isSuccess = lastItemInCallContext.type === 'RETURN'
          return { ...item, success: isSuccess, returnIndex: index, output, gasCost }
        }
        return { ...item, success: true, returnIndex: index, gasCost }
      }
      return item
    })
  }

  private async decodeCallInputOutput() {
    const abis = await this.abiReader.getAbis(this.contractAddressesLists)

    Object.keys(abis).forEach((address) => {
      this.fragmentReader.loadFragmentsFromAbi(abis[address])
    })

    this.parsedTransactionList.forEach((item, index) => {
      if (chceckIfOfCallType(item) && item.isContract && item.input) {
        const { decodedInput, decodedOutput, functionDescription, errorDescription }
            = this.fragmentReader.decodeFragment(item.success, item.input, item.output)

        this.parsedTransactionList[index] = { ...item, functionDescription, errorDescription, decodedOutput, decodedInput }
      }
    })
  }

  private parseStorageData() {
    for (let index = 0; index < this.parsedTransactionList.length; index++) {
      const item = this.parsedTransactionList[index]

      if ((chceckIfOfCallType(item) && item.isContract) || checkIfOfCreateType(item)) {
        const storageHandler = new StorageHandler(this.structLogs, item)

        storageHandler.parseStorageData()

        if (!item.success) storageHandler.returnExpectedStorage()

        this.parsedTransactionList[index] = { ...item, storageLogs: storageHandler.returnStorageLogs() }
      }
    }
  }

  public async analyze() {
    await this.getStructLogs()

    this.parsedTransactionList = this.parseStructLogs()

    this.parsedTransactionList = await this.parseAndAddRootTraceLog()

    this.parsedTransactionList = this.checkIfCallPointsToContract()

    this.parsedTransactionList = this.combineCallWithItsReturn()

    await this.decodeCallInputOutput()

    this.parsedTransactionList = getCallAndCreateType(this.parsedTransactionList)

    this.parseStorageData()

    return this.parsedTransactionList
  }

  public async baseAnalyze() {
    await this.getStructLogs()

    this.parsedTransactionList = this.parseStructLogs()

    this.parsedTransactionList = await this.parseAndAddRootTraceLog()

    this.parsedTransactionList = this.checkIfCallPointsToContract()

    this.parsedTransactionList = this.combineCallWithItsReturn()

    this.parsedTransactionList = getCallAndCreateType(this.parsedTransactionList)

    this.parseStorageData()

    return this.parsedTransactionList as (ICallTypeTraceLog | ICreateTypeTraceLog)[]
  }
}
