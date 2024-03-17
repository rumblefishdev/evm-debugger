/* eslint-disable sonarjs/cognitive-complexity */

import type {
  TSourceMapConverstionPayload,
  TStepInstrctionsMap,
  TPcIndexedStepInstructions,
  TStructlogsPerStartLine,
  TAnalyzerContractBaseData,
  TAnalyzerContractSettings,
} from '@evm-debuger/types'

import { getPcIndexedStructlogsForContractAddress } from './helpers/helpers'
import {
  createSourceMapIdentifier,
  createSourceMapToSourceCodeDictionary,
  getUniqueSourceMaps,
  sourceMapConverter,
} from './utils/sourceMapConverter'
import { DataLoader } from './utils/dataLoader'
import { EVMMachine } from './utils/evmMachine'
import { parseSourceCode } from './helpers/parseSourceCodes'
import { TraceCreator } from './utils/traceCreator'

export class TxAnalyzer {
  public readonly dataLoader: DataLoader = new DataLoader()
  private readonly evmMachine = new EVMMachine()
  private readonly traceCreator = new TraceCreator(this.dataLoader)

  public getContractsInstructions(): TStepInstrctionsMap {
    const traceLogs = this.dataLoader.analyzerTraceLogs.get()

    const dataToDecode: TSourceMapConverstionPayload[] = []
    const listOfContractsAddresses = this.dataLoader.getAddressesList()

    for (const contractAddress of listOfContractsAddresses) {
      const contractSourceMap = this.dataLoader.inputContractData.get(contractAddress, 'sourceMap')
      const contractSourceFiles = this.dataLoader.analyzerContractData.get(contractAddress, 'sourceFiles')
      const contractBytecode = this.dataLoader.inputContractData.get(contractAddress, 'bytecode')
      const contractName = this.dataLoader.analyzerContractData.get(contractAddress, 'contractBaseData').name

      if (!contractSourceMap || !contractSourceFiles) continue

      dataToDecode.push({ contractSourceMap, contractSourceFiles, contractName, contractBytecode, contractAddress })
    }

    return dataToDecode
      .map(({ contractAddress, contractBytecode, contractSourceMap, contractSourceFiles }) => {
        const convertedSourceMap = sourceMapConverter(contractSourceMap)
        const uniqueSourceMaps = getUniqueSourceMaps(convertedSourceMap)

        const uniqueSoruceMapsCodeLinesDictionary = createSourceMapToSourceCodeDictionary(contractSourceFiles, uniqueSourceMaps)

        const parsedBytecode = this.evmMachine.dissasembleBytecode(contractBytecode)

        const instructions: TPcIndexedStepInstructions = convertedSourceMap.reduce((accumulator, sourceMapEntry, index) => {
          const instructionId = createSourceMapIdentifier(sourceMapEntry)

          if (!uniqueSoruceMapsCodeLinesDictionary[instructionId]) return accumulator
          if (!parsedBytecode[index]) return accumulator

          const { pc, opcode } = parsedBytecode[index]

          accumulator[pc] = { ...uniqueSoruceMapsCodeLinesDictionary[instructionId], pc, opcode }
          return accumulator
        }, {} as TPcIndexedStepInstructions)

        const contractStructlogs = getPcIndexedStructlogsForContractAddress(
          traceLogs,
          this.dataLoader.inputStructlogs.get(),
          contractAddress,
        )

        const structlogsPerStartLine = Object.values(instructions).reduce((accumulator, instruction) => {
          if (!accumulator[instruction.fileId]) accumulator[instruction.fileId] = {}
          if (!accumulator[instruction.fileId][instruction.startCodeLine] && contractStructlogs[instruction.pc]?.length > 0)
            accumulator[instruction.fileId][instruction.startCodeLine] = []
          if (contractStructlogs[instruction.pc]?.length > 0) {
            accumulator[instruction.fileId][instruction.startCodeLine].push(...contractStructlogs[instruction.pc])
          }
          return accumulator
        }, {} as TStructlogsPerStartLine)

        return { structlogsPerStartLine, instructions, contractAddress }
      })
      .reduce((accumulator, { contractAddress, instructions, structlogsPerStartLine }) => {
        accumulator[contractAddress] = { structlogsPerStartLine, instructions }
        return accumulator
      }, {} as TStepInstrctionsMap)
  }

  private disassembleTransactionBytecodes() {
    const transactionContractsAddresses = this.dataLoader.getAddressesList()
    for (const address of transactionContractsAddresses) {
      const contractBytecode = this.dataLoader.inputContractData.get(address, 'bytecode')
      const etherscanBytecode = this.dataLoader.inputContractData.get(address, 'etherscanBytecode')

      const etherscanDisassembledBytecode = this.evmMachine.dissasembleBytecode(etherscanBytecode)
      const disassembledBytecode = this.evmMachine.dissasembleBytecode(contractBytecode)

      this.dataLoader.analyzerContractData.set(address, 'disassembledBytecode', disassembledBytecode)
      this.dataLoader.analyzerContractData.set(address, 'disassembledEtherscanBytecode', etherscanDisassembledBytecode)
    }
  }

  private createSourceFiles() {
    const contractsAddresses = this.dataLoader.getAddressesList()

    for (const address of contractsAddresses) {
      const contractName = this.dataLoader.inputContractData.get(address, 'sourceData')?.contractName
      const contractSourceCode = this.dataLoader.inputContractData.get(address, 'sourceCode')
      const contractYulSource = this.dataLoader.inputContractData.get(address, 'yulSource')
      const contractSourceOrder = this.dataLoader.inputContractData.get(address, 'sourceFilesOrder')

      if (!contractSourceCode || !contractSourceOrder || !contractName) continue

      const sourceFiles = parseSourceCode(contractName, contractSourceCode, contractYulSource)

      const contractSourceOrderValues = Object.values(contractSourceOrder)

      if (contractYulSource) contractSourceOrderValues.push('utility.yul')

      const sourceFilesInOrder = Object.values(contractSourceOrderValues).map((sourceFileName) => {
        return sourceFiles[sourceFileName]
      })

      this.dataLoader.analyzerContractData.set(address, 'sourceFiles', sourceFilesInOrder)
    }
  }

  private createContractBaseData() {
    const contractsAddresses = this.dataLoader.getAddressesList()

    for (const address of contractsAddresses) {
      const sourceData = this.dataLoader.inputContractData.get(address, 'sourceData')
      const contractBaseData: TAnalyzerContractBaseData = {
        name: sourceData.contractName,
        address,
      }
      this.dataLoader.analyzerContractData.set(address, 'contractBaseData', contractBaseData)
    }
  }

  private createContractSettings() {
    const contractsAddresses = this.dataLoader.getAddressesList()

    for (const address of contractsAddresses) {
      const sourceData = this.dataLoader.inputContractData.get(address, 'sourceData')
      const contractSettings: TAnalyzerContractSettings = {
        optimization: { runs: Number(sourceData.runs), isEnabled: sourceData.optimizationUsed === '1' },
        license: sourceData.licenseType,
        evmVersion: sourceData.evmVersion,
        compilerVersion: sourceData.compilerVersion,
        address,
      }

      this.dataLoader.analyzerContractData.set(address, 'contractSettings', contractSettings)
    }
  }

  public runFullAnalysis() {
    this.createContractBaseData()
    this.createContractSettings()
    this.createSourceFiles()

    this.disassembleTransactionBytecodes()

    this.traceCreator.processTransactionStructLogs()

    const { contractsDisassembledBytecodes, contractsBaseData, contractsSettings, structLogs, transactionInfo, traceLogs } =
      this.dataLoader.getAnalyzerAnalysisOutput()

    return {
      transactionInfo,
      traceLogs,
      structLogs,
      // instructionsMap,
      contractsSettings,
      // contractSighashes,
      contractsDisassembledBytecodes,
      contractsBaseData,
    }
  }

  public getTraceLogsContractAddresses(): string[] {
    return this.traceCreator.getContractAddressesInTransaction()
  }
}
