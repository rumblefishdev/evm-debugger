/* eslint-disable sonarjs/cognitive-complexity */

import { BaseOpcodesHex } from '@evm-debuger/types'
import type {
  TEventInfo,
  TSourceMapConverstionPayload,
  TStepInstrctionsMap,
  TPcIndexedStepInstructions,
  TStructlogsPerStartLine,
  TIndexedStructLog,
  TTraceLog,
  TTraceReturnLog,
  TDissasembledBytecodeStructlog,
  TAnalyzerContractBytecodeOutput,
} from '@evm-debuger/types'
import { toBigInt } from 'ethers'

import {
  convertTxInfoToTraceLog,
  getStorageAddressFromTransactionInfo,
  getSafeHex,
  readMemory,
  getPcIndexedStructlogsForContractAddress,
  getFunctionBlockStartStructLogs,
  getFunctionBlockEndStructLogs,
  selectLastStructLogInFunctionBlockContext,
  selectFunctionBlockContextForLog,
} from './helpers/helpers'
import { StructLogParser } from './utils/structLogParser'
import { StackCounter } from './utils/stackCounter'
import { StorageHandler } from './utils/storageHandler'
import { FragmentReader } from './utils/fragmentReader'
import { getLogGroupTypeOpcodesArgumentsData } from './helpers/structlogArgumentsExtractors'
import { SigHashStatuses } from './sigHashes'
import {
  createSourceMapIdentifier,
  createSourceMapToSourceCodeDictionary,
  getUniqueSourceMaps,
  sourceMapConverter,
} from './utils/sourceMapConverter'
import { createErrorDescription } from './resources/builtinErrors'
import { checkOpcodeIfOfCallGroupType, checkOpcodeIfOfLogGroupType, checkOpcodeIfOfReturnGroupType } from './helpers/structLogTypeGuards'
import { DataLoader } from './utils/dataLoader'
import { EVMMachine } from './utils/evmMachine'

export class TxAnalyzer {
  private readonly storageHandler = new StorageHandler()
  private readonly evmMachine = new EVMMachine()
  private stackCounter: StackCounter = new StackCounter()
  private fragmentReader: FragmentReader
  public dataLoader: DataLoader = new DataLoader()

  private convertToTraceLog(structLog: TIndexedStructLog[]): TTraceLog[] {
    const structLogParser = new StructLogParser(this.dataLoader.getStructLogs(), this.stackCounter)
    return structLog.map((item) => structLogParser.parseStructLogToTraceLog(item))
  }

  private convertToTraceReturnLog(structLog: TIndexedStructLog[]): TTraceReturnLog[] {
    const structLogParser = new StructLogParser(this.dataLoader.getStructLogs(), this.stackCounter)
    return structLog.map((item) => structLogParser.parseStructLogToTraceReturnLog(item))
  }

  private parseAndAddRootTraceLog(transactionList: TTraceLog[]) {
    const rootTraceLog = convertTxInfoToTraceLog(this.dataLoader.getStructLogs()[0], this.dataLoader.getTransactionInfo())
    return [rootTraceLog, ...transactionList]
  }

  private combineCallWithItsReturn(traceLogs: TTraceLog[], traceReturnLogs: TTraceReturnLog[]): TTraceLog[] {
    return traceLogs.map((traceLog) => {
      if (!traceLog.isContract) {
        const result = {
          ...traceLog,
          returnIndex: traceLog.startIndex,
          gasCost: traceLog.passedGas - this.dataLoader.getStructLogs()[traceLog.index + 1].gas,
        }
        if (traceLog.input === '0x') result.isSuccess = true
        return result
      }

      const lastItemInCallContext = selectLastStructLogInFunctionBlockContext(this.dataLoader.getStructLogs(), traceLog)

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

          const callStructLogContext = [...this.dataLoader.getStructLogs()]
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
        const storageLogs = this.storageHandler.getParsedStorageLogs(traceLog, this.dataLoader.getStructLogs())
        transactionList[index] = { ...traceLog, storageLogs }
      }
    }

    return transactionList
  }

  private getTraceLogsContractAddresses(transactionList: TTraceLog[]): string[] {
    const contractAddressList: string[] = []
    transactionList.forEach((item) => {
      if (checkOpcodeIfOfCallGroupType(item.op) && item.isContract && !contractAddressList.includes(item.address))
        contractAddressList.push(item.address)
    })

    return contractAddressList
  }

  private extendWithBlockNumber(transactionList: TTraceLog[]) {
    return transactionList.map((item) => ({
      ...item,
      blockNumber: toBigInt(this.dataLoader.getTransactionInfo().blockNumber).toString(),
    }))
  }

  private loadContractsAbis() {
    const contracts = this.dataLoader.getContractsData()
    for (const contractAdata of Object.values(contracts)) {
      if (contractAdata.applicationBinaryInterface) this.fragmentReader.loadFragmentsFromAbi(contractAdata.applicationBinaryInterface)
    }
  }

  private getContractSighashList(mainTraceLogList: TTraceLog[]) {
    const sighashStatues = new SigHashStatuses()
    for (const traceLog of mainTraceLogList)
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

    return sighashStatues.sighashStatusList
  }

  public getContractsInstructions(traceLogs: TTraceLog[]): TStepInstrctionsMap {
    const dataToDecode: TSourceMapConverstionPayload[] = []
    const transactionContracts = this.dataLoader.getContractsData()
    const transactionContractsList = Object.values(transactionContracts)

    for (const contract of transactionContractsList) {
      if (!contract.sourceMap || !contract.files) continue

      const { sourceMap, name, files, bytecode, address, yulFileContent } = contract

      if (yulFileContent) {
        files[Object.keys(files).length] = { sourceName: 'Utility.yul', content: yulFileContent }
      }

      dataToDecode.push({
        sourceMap,
        name,
        files,
        bytecode,
        address,
      })
    }

    return dataToDecode
      .map(({ address, bytecode, sourceMap, files }) => {
        const convertedSourceMap = sourceMapConverter(sourceMap)
        const uniqueSourceMaps = getUniqueSourceMaps(convertedSourceMap)

        const uniqueSoruceMapsCodeLinesDictionary = createSourceMapToSourceCodeDictionary(files, uniqueSourceMaps)

        const parsedBytecode = this.evmMachine.dissasembleBytecode(bytecode)

        const instructions: TPcIndexedStepInstructions = convertedSourceMap.reduce((accumulator, sourceMapEntry, index) => {
          const instructionId = createSourceMapIdentifier(sourceMapEntry)

          if (!uniqueSoruceMapsCodeLinesDictionary[instructionId]) return accumulator
          if (!parsedBytecode[index]) return accumulator

          const { pc, opcode } = parsedBytecode[index]

          accumulator[pc] = { ...uniqueSoruceMapsCodeLinesDictionary[instructionId], pc, opcode }
          return accumulator
        }, {} as TPcIndexedStepInstructions)

        const contractStructlogs = getPcIndexedStructlogsForContractAddress(traceLogs, this.dataLoader.getStructLogs(), address)

        const structlogsPerStartLine = Object.values(instructions).reduce((accumulator, instruction) => {
          if (!accumulator[instruction.fileId]) accumulator[instruction.fileId] = {}
          if (!accumulator[instruction.fileId][instruction.startCodeLine] && contractStructlogs[instruction.pc]?.length > 0)
            accumulator[instruction.fileId][instruction.startCodeLine] = []
          if (contractStructlogs[instruction.pc]?.length > 0) {
            accumulator[instruction.fileId][instruction.startCodeLine].push(...contractStructlogs[instruction.pc])
          }
          return accumulator
        }, {} as TStructlogsPerStartLine)

        return { structlogsPerStartLine, instructions, address }
      })
      .reduce((accumulator, { address, instructions, structlogsPerStartLine }) => {
        accumulator[address] = { structlogsPerStartLine, instructions }
        return accumulator
      }, {} as TStepInstrctionsMap)
  }

  private disassembleTransactionBytecodes() {
    const transactionContracts = this.dataLoader.getContractsData()
    const disassembledBytecodes: Record<string, TAnalyzerContractBytecodeOutput> = {}

    for (const [address, contractData] of Object.entries(transactionContracts)) {
      const etherscanDissasembleResult = this.evmMachine.dissasembleBytecode(contractData.etherscanBytecode)
      const solcDissasembleResult = this.evmMachine.dissasembleBytecode(contractData.bytecode)

      disassembledBytecodes[address] = {
        solcDissasembleResult,
        solcBytecode: contractData.bytecode,
        etherscanDissasembleResult,
        etherscanBytecode: contractData.etherscanBytecode,
        address,
      }
    }

    return disassembledBytecodes
  }

  public getContractAddressesInTransaction() {
    if (this.dataLoader.getStructLogs().length === 0) throw new Error(`Too primitive transaction without stack calls.`)

    const storageAddress = getStorageAddressFromTransactionInfo(this.dataLoader.getTransactionInfo())
    this.stackCounter.visitDepth(0, storageAddress)

    const functionBlockStartStructLogs = getFunctionBlockStartStructLogs(this.dataLoader.getStructLogs())
    const traceLogs = this.convertToTraceLog(functionBlockStartStructLogs)
    const traceLogsList = this.parseAndAddRootTraceLog(traceLogs)

    return this.getTraceLogsContractAddresses(traceLogsList)
  }

  public analyze() {
    if (this.dataLoader.getStructLogs().length === 0) throw new Error(`Too primitive transaction without stack calls.`)

    this.fragmentReader = new FragmentReader()
    this.loadContractsAbis()

    const storageAddress = getStorageAddressFromTransactionInfo(this.dataLoader.getTransactionInfo())
    this.stackCounter.visitDepth(0, storageAddress)

    const disassembledBytecodes = this.disassembleTransactionBytecodes()

    const functionBlockStartStructLogs = getFunctionBlockStartStructLogs(this.dataLoader.getStructLogs())
    const functionBlockEndStructLogs = getFunctionBlockEndStructLogs(this.dataLoader.getStructLogs())

    const traceLogs = this.convertToTraceLog(functionBlockStartStructLogs)
    const traceReturnLogs = this.convertToTraceReturnLog(functionBlockEndStructLogs)

    const traceLogsWithRoot = this.parseAndAddRootTraceLog(traceLogs)

    const traceLogsListWithReturnData = this.combineCallWithItsReturn(traceLogsWithRoot, traceReturnLogs)

    const traceLogsListWithSuccessFlag = this.markLogEntryAsFailureIfParentReverted(traceLogsListWithReturnData)

    const traceLogsWithDecodedIO = this.decodeCallInputOutput(traceLogsListWithSuccessFlag)
    const traceLogsWithStorageData = this.extendWithStorageData(traceLogsWithDecodedIO)
    const traceLogsWithLogsData = this.extendWithLogsData(traceLogsWithStorageData)
    const traceLogsWithBlockNumber = this.extendWithBlockNumber(traceLogsWithLogsData)

    const contractAddresses = this.getTraceLogsContractAddresses(traceLogsWithBlockNumber)
    const contractSighashesInfo = this.getContractSighashList(traceLogsWithBlockNumber)

    const instructionsMap = this.getContractsInstructions(traceLogsWithBlockNumber)

    return {
      transactionInfo: this.dataLoader.getTransactionInfo(),
      structLogs: this.dataLoader.getStructLogs(),
      mainTraceLogList: traceLogsWithBlockNumber,
      instructionsMap,
      disassembledBytecodes,
      contractBaseData: this.dataLoader.getContractsBaseData(),
      analyzeSummary: { contractSighashesInfo, contractAddresses },
    }
  }
}
