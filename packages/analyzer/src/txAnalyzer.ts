/* eslint-disable sonarjs/cognitive-complexity */
import type {
  IFilteredStructLog,
  TEventInfo,
  TMainTraceLogs,
  TReturnedTraceLog,
  TSourceMapConverstionPayload,
  TStepInstrctionsMap,
  TPcIndexedStepInstructions,
  TTransactionData,
  TStepInstruction,
  IStructLog,
  TStructlogsPerStartLine,
} from '@evm-debuger/types'
import { toBigInt } from 'ethers'
import type { ErrorDescription, ParamType } from 'ethers'

import {
  checkIfOfCallType,
  checkIfOfCreateOrCallType,
  checkIfOfCreateType,
  checkIfOfReturnType,
  convertTxInfoToTraceLog,
  getFilteredStructLogs,
  getStorageAddressFromTransactionInfo,
  getLastItemInCallTypeContext,
  getLastLogWithRevertType,
  getSafeHex,
  isLogType,
  prepareTraceToSearch,
  readMemory,
  getPcIndexedStructlogsForContractAddress,
} from './helpers/helpers'
import { StructLogParser } from './dataExtractors/structLogParser'
import { StackCounter } from './helpers/stackCounter'
import { StorageHandler } from './dataExtractors/storageHandler'
import { FragmentReader } from './helpers/fragmentReader'
import { extractLogTypeArgsData } from './dataExtractors/argsExtractors'
import { SigHashStatuses } from './sigHashes'
import {
  createSourceMapIdentifier,
  createSourceMapToSourceCodeDictionary,
  getUniqueSourceMaps,
  opcodesConverter,
  sourceMapConverter,
} from './dataExtractors/sourceMapConverter'
import { createErrorDescription } from './resources/builtinErrors'

export class TxAnalyzer {
  constructor(public readonly transactionData: TTransactionData) {
    if (transactionData.structLogs.length === 0) throw new Error(`Too primitive transaction without stack calls.`)
    this.stackCounter = new StackCounter()

    const storageAddress = getStorageAddressFromTransactionInfo(transactionData.transactionInfo)
    this.stackCounter.visitDepth(0, storageAddress)
  }

  private readonly storageHandler = new StorageHandler()
  private readonly stackCounter
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

        if (nextStructLog.depth === depth + 1) return { ...item, isContract: true }
      }
      if (checkIfOfCreateType(item)) return { ...item, isContract: true }
      return { ...item, isContract: false }
    })
  }

  private combineCallWithItsReturn(traceLogs: TReturnedTraceLog[]) {
    return traceLogs.map((item, rootIndex) => {
      if (checkIfOfCallType(item) || checkIfOfCreateType(item)) {
        if (checkIfOfCallType(item) && !item.isContract) {
          const result = {
            ...item,
            returnIndex: item.startIndex,
            gasCost: item.passedGas - this.transactionData.structLogs[item.index + 1].gas,
          }
          if (item.input === '0x') result.isSuccess = true
          return result
        }

        const lastItemInCallContext = getLastItemInCallTypeContext(traceLogs, rootIndex, item.depth)

        if (!lastItemInCallContext && item.gasCost > item.passedGas) {
          return {
            ...item,
            isSuccess: false,
            isReverted: true,
            errorDescription: createErrorDescription('OUT_OF_GAS'),
          }
        }
        if (!lastItemInCallContext) return { ...item, isSuccess: false }

        const { index, passedGas } = lastItemInCallContext
        const gasCost = item.passedGas - passedGas

        if (lastItemInCallContext.type === 'RETURN' || lastItemInCallContext.type === 'REVERT') {
          const { output } = lastItemInCallContext
          const isSuccess = lastItemInCallContext.type === 'RETURN'
          const isReverted = lastItemInCallContext.type === 'REVERT'
          return {
            ...item,
            returnIndex: index,
            output,
            isSuccess,
            isReverted,
            gasCost,
          }
        }
        return { ...item, returnIndex: index, isSuccess: true, gasCost }
      }
      return item
    })
  }

  private markLogEntryAsFailureIfParentReverted(traceLogs: TReturnedTraceLog[]) {
    const logIndexesToMarkAsFailure = new Set()
    for (const [rootIndex, item] of traceLogs.entries())
      if (checkIfOfCallType(item) || checkIfOfCreateType(item)) {
        const childrenLogs = prepareTraceToSearch(traceLogs, rootIndex, item.depth, false) as TReturnedTraceLog[]
        const lastItemWithRevertType = getLastLogWithRevertType(childrenLogs, item.depth)
        if (lastItemWithRevertType) childrenLogs.forEach((log) => logIndexesToMarkAsFailure.add(log.index))
      }

    return traceLogs.map((log) => {
      return logIndexesToMarkAsFailure.has(log.index) ? { ...log, isSuccess: false } : log
    })
  }

  private decodeCallInputOutput(mainTraceLogList: TMainTraceLogs[]) {
    const { abis } = this.transactionData

    for (const abi of Object.values(abis)) this.fragmentReader.loadFragmentsFromAbi(abi)

    return mainTraceLogList.map((item, index) => {
      if (checkIfOfCallType(item) && item.isContract && item.input) {
        const { decodedInput, decodedOutput, errorDescription, functionFragment } = this.fragmentReader.decodeFragment(
          item.isReverted,
          item.input,
          item.output,
        )

        return { ...item, functionFragment, errorDescription: item.errorDescription || errorDescription, decodedOutput, decodedInput }
      }
      return item
    })
  }

  private extendWithLogsData(mainTraceLogList: TMainTraceLogs[]) {
    mainTraceLogList.forEach((item, index) => {
      if (checkIfOfCallType(item) && item.isContract) {
        const events: TEventInfo[] = []
        if (item.isSuccess) {
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
        }
        mainTraceLogList[index] = { ...item, events }
      }
    })

    return mainTraceLogList
  }

  private extendWithStorageData(transactionList: TMainTraceLogs[]) {
    for (let index = 0; index < transactionList.length; index++) {
      const traceLog = transactionList[index]

      if (checkIfOfCreateOrCallType(traceLog) && traceLog.isContract) {
        const storageLogs = this.storageHandler.getParsedStorageLogs(traceLog, this.transactionData.structLogs)
        transactionList[index] = { ...traceLog, storageLogs }
      }
    }

    return transactionList
  }

  private getTraceLogsContractAddresses(transactionList: TMainTraceLogs[]): string[] {
    const contractAddressList = []
    transactionList.forEach((item) => {
      if (checkIfOfCallType(item) && item.isContract && !contractAddressList.includes(item.address)) contractAddressList.push(item.address)
    })

    return contractAddressList
  }

  private extendWithBlockNumber(transactionList: TMainTraceLogs[]) {
    return transactionList.map((item) => ({
      ...item,
      blockNumber: toBigInt(this.transactionData.transactionInfo.blockNumber).toString(),
    }))
  }

  private getCallAndCreateType = (transactionList: TReturnedTraceLog[]): TMainTraceLogs[] => {
    return transactionList.filter(checkIfOfCreateOrCallType)
  }

  private getContractSighashList(mainTraceLogList: TMainTraceLogs[]) {
    const sighashStatues = new SigHashStatuses()
    for (const traceLog of mainTraceLogList)
      if (
        checkIfOfCallType(traceLog) &&
        traceLog.isContract &&
        traceLog.input &&
        traceLog.input !== '0x' // this is pure transfer of ETH
      ) {
        const { input, address, errorDescription, functionFragment } = traceLog
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

    return sighashStatues.sighashStatusList
  }

  public getContractAddressesInTransaction() {
    const baseStructLogs = getFilteredStructLogs(this.transactionData.structLogs)
    const parsedTraceLogs = this.getParsedTraceLogs(baseStructLogs)
    const traceLogsList = this.parseAndAddRootTraceLog(parsedTraceLogs)
    const traceLogsListWithContractFlag = this.returnTransactionListWithContractFlag(traceLogsList)
    const mainTraceLogList = this.getCallAndCreateType(traceLogsListWithContractFlag)

    return this.getTraceLogsContractAddresses(mainTraceLogList)
  }

  public getContractsInstructions(traceLogs: TReturnedTraceLog[]): TStepInstrctionsMap {
    const dataToDecode: TSourceMapConverstionPayload[] = []

    if (!this.transactionData.sourceMaps) return {}

    Object.keys(this.transactionData.contractNames).forEach((address) => {
      if (!this.transactionData.sourceMaps[address] || !this.transactionData.sourceFiles[address]) return

      const contractName = this.transactionData.contractNames[address]
      const source = this.transactionData.sourceMaps[address].find((_sourceMap) => _sourceMap.contractName === contractName)
      const sourceFiles = this.transactionData.sourceFiles[address]

      dataToDecode.push({
        sourceMap: source.deployedBytecode.sourceMap,
        sourceFiles,
        opcodes: source.deployedBytecode.opcodes,
        contractName,
        bytecode: source.deployedBytecode.object,
        address,
      })
    })

    return dataToDecode
      .map(({ address, opcodes, sourceMap, sourceFiles }) => {
        const convertedSourceMap = sourceMapConverter(sourceMap)
        const uniqueSourceMaps = getUniqueSourceMaps(convertedSourceMap)

        const uniqueSoruceMapsCodeLinesDictionary = createSourceMapToSourceCodeDictionary(sourceFiles, uniqueSourceMaps)

        const parsedOpcodes = opcodesConverter(opcodes.trim())

        const instructions: TPcIndexedStepInstructions = convertedSourceMap.reduce((accumulator, sourceMapEntry, index) => {
          const instructionId = createSourceMapIdentifier(sourceMapEntry)

          if (!uniqueSoruceMapsCodeLinesDictionary[instructionId]) return accumulator
          if (!parsedOpcodes[index]) return accumulator

          const { pc, opcode } = parsedOpcodes[index]

          accumulator[pc] = { ...uniqueSoruceMapsCodeLinesDictionary[instructionId], pc, opcode }
          return accumulator
        }, {} as TPcIndexedStepInstructions)

        const contractStructlogs = getPcIndexedStructlogsForContractAddress(traceLogs, this.transactionData.structLogs, address)

        console.log('contractStructlogs', contractStructlogs)

        const structlogsPerStartLine = Object.values(instructions).reduce((accumulator, instruction) => {
          if (!accumulator[instruction.fileId]) accumulator[instruction.fileId] = {}
          if (!accumulator[instruction.fileId][instruction.startCodeLine] && contractStructlogs[instruction.pc])
            accumulator[instruction.fileId][instruction.startCodeLine] = new Set()
          if (contractStructlogs[instruction.pc]) {
            accumulator[instruction.fileId][instruction.startCodeLine].add(contractStructlogs[instruction.pc])
          }
          return accumulator
        }, {} as TStructlogsPerStartLine)

        console.log('structlogsPerStartLine', structlogsPerStartLine)

        return { structlogsPerStartLine, instructions, address }
      })
      .reduce((accumulator, { address, instructions, structlogsPerStartLine }) => {
        accumulator[address] = { structlogsPerStartLine, instructions }
        return accumulator
      }, {} as TStepInstrctionsMap)
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

    const instructionsMap = this.getContractsInstructions(mainTraceLogList)

    return {
      mainTraceLogList,
      instructionsMap,
      analyzeSummary: { contractSighashesInfo, contractAddresses },
    }
  }
}
