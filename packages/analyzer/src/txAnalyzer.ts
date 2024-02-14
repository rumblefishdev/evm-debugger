/* eslint-disable sonarjs/cognitive-complexity */

import {
  type TEventInfo,
  type TSourceMapConverstionPayload,
  type TStepInstrctionsMap,
  type TPcIndexedStepInstructions,
  type TTransactionData,
  type TStructlogsPerStartLine,
  type TIndexedStructLog,
  type TTraceLog,
  type TTraceReturnLog,
  BaseOpcodesHex,
} from '@evm-debuger/types'
import { toBigInt } from 'ethers'

import {
  convertTxInfoToTraceLog,
  indexRawStructLogs,
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
  opcodesConverter,
  sourceMapConverter,
} from './utils/sourceMapConverter'
import { createErrorDescription } from './resources/builtinErrors'
import { checkOpcodeIfOfCallGroupType, checkOpcodeIfOfLogGroupType, checkOpcodeIfOfReturnGroupType } from './helpers/structLogTypeGuards'

export class TxAnalyzer {
  constructor(public readonly transactionData: TTransactionData) {
    if (transactionData.structLogs.length === 0) throw new Error(`Too primitive transaction without stack calls.`)
    this.stackCounter = new StackCounter()

    const storageAddress = getStorageAddressFromTransactionInfo(transactionData.transactionInfo)
    this.stackCounter.visitDepth(0, storageAddress)
  }

  private readonly storageHandler = new StorageHandler()
  private readonly stackCounter: StackCounter
  private fragmentReader: FragmentReader

  private convertToTraceLog(structLog: TIndexedStructLog[]): TTraceLog[] {
    const structLogParser = new StructLogParser(this.transactionData.structLogs, this.stackCounter)
    return structLog.map((item) => structLogParser.parseStructLogToTraceLog(item))
  }

  private convertToTraceReturnLog(structLog: TIndexedStructLog[]): TTraceReturnLog[] {
    const structLogParser = new StructLogParser(this.transactionData.structLogs, this.stackCounter)
    return structLog.map((item) => structLogParser.parseStructLogToTraceReturnLog(item))
  }

  private parseAndAddRootTraceLog(transactionList: TTraceLog[]) {
    const rootTraceLog = convertTxInfoToTraceLog(this.transactionData.structLogs[0], this.transactionData.transactionInfo)
    return [rootTraceLog, ...transactionList]
  }

  private combineCallWithItsReturn(traceLogs: TTraceLog[], traceReturnLogs: TTraceReturnLog[]): TTraceLog[] {
    return traceLogs.map((traceLog) => {
      if (!traceLog.isContract) {
        const result = {
          ...traceLog,
          returnIndex: traceLog.startIndex,
          gasCost: traceLog.passedGas - this.transactionData.structLogs[traceLog.index + 1].gas,
        }
        if (traceLog.input === '0x') result.isSuccess = true
        return result
      }

      const lastItemInCallContext = selectLastStructLogInFunctionBlockContext(this.transactionData.structLogs, traceLog)

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
    const { abis } = this.transactionData

    for (const abi of Object.values(abis)) this.fragmentReader.loadFragmentsFromAbi(abi)

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

          const callStructLogContext = [...this.transactionData.structLogs]
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
        const storageLogs = this.storageHandler.getParsedStorageLogs(traceLog, this.transactionData.structLogs)
        transactionList[index] = { ...traceLog, storageLogs }
      }
    }

    return transactionList
  }

  private getTraceLogsContractAddresses(transactionList: TTraceLog[]): string[] {
    const contractAddressList = []
    transactionList.forEach((item) => {
      if (checkOpcodeIfOfCallGroupType(item.op) && item.isContract && !contractAddressList.includes(item.address))
        contractAddressList.push(item.address)
    })

    return contractAddressList
  }

  private extendWithBlockNumber(transactionList: TTraceLog[]) {
    return transactionList.map((item) => ({
      ...item,
      blockNumber: toBigInt(this.transactionData.transactionInfo.blockNumber).toString(),
    }))
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

  public getContractAddressesInTransaction() {
    const indexedStructLogs = indexRawStructLogs(this.transactionData.structLogs)
    const functionBlockStartStructLogs = getFunctionBlockStartStructLogs(indexedStructLogs)
    const traceLogs = this.convertToTraceLog(functionBlockStartStructLogs)
    const traceLogsList = this.parseAndAddRootTraceLog(traceLogs)

    return this.getTraceLogsContractAddresses(traceLogsList)
  }

  public analyze() {
    this.fragmentReader = new FragmentReader()
    this.transactionData.structLogs = indexRawStructLogs(this.transactionData.structLogs)

    const functionBlockStartStructLogs = getFunctionBlockStartStructLogs(this.transactionData.structLogs)
    const functionBlockEndStructLogs = getFunctionBlockEndStructLogs(this.transactionData.structLogs)

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

    console.log('traceLogsWithBlockNumber', traceLogsWithBlockNumber)

    return {
      mainTraceLogList: traceLogsWithBlockNumber,
      instructionsMap,
      analyzeSummary: { contractSighashesInfo, contractAddresses },
    }
  }
}
