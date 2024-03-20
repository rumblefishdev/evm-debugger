import { type TAnalyzerContractBaseData, type TAnalyzerContractsRawData } from '@evm-debuger/types'
import { Interface } from 'ethers'

import { DataLoader } from './utils/dataLoader'
import { EVMMachine } from './utils/evmMachine'
import { parseSourceCode } from './helpers/parseSourceCodes'
import { TraceCreator } from './utils/traceCreator'
import { SourceLineParser } from './utils/sourceLineParser'
import { selectFunctionBlockContextForLog } from './helpers/helpers'

export class TxAnalyzer {
  public readonly dataLoader: DataLoader = new DataLoader()
  private readonly evmMachine = new EVMMachine()
  private readonly traceCreator = new TraceCreator(this.dataLoader)
  private readonly sourceLineParser = new SourceLineParser(this.dataLoader)

  private disassembleTransactionBytecodes() {
    const transactionContractsAddresses = this.dataLoader.getAddressesList()
    for (const address of transactionContractsAddresses) {
      const contractBytecode = this.dataLoader.inputContractData.get(address, 'bytecode')
      const etherscanBytecode = this.dataLoader.inputContractData.get(address, 'etherscanBytecode')

      if (etherscanBytecode) {
        const etherscanDisassembledBytecode = this.evmMachine.dissasembleBytecode(etherscanBytecode)
        this.dataLoader.analyzerContractData.set(address, 'disassembledEtherscanBytecode', etherscanDisassembledBytecode)
      }

      if (contractBytecode) {
        const disassembledBytecode = this.evmMachine.dissasembleBytecode(contractBytecode)
        this.dataLoader.analyzerContractData.set(address, 'disassembledBytecode', disassembledBytecode)
      }
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
        optimization: { runs: Number(sourceData.runs), isEnabled: sourceData.optimizationUsed === '1' },
        name: sourceData.contractName,
        license: sourceData.licenseType,
        evmVersion: sourceData.evmVersion,
        compilerVersion: sourceData.compilerVersion,
        address,
      }
      this.dataLoader.analyzerContractData.set(address, 'contractBaseData', contractBaseData)
    }
  }

  private createFunctionsList() {
    const structlogs = this.dataLoader.analyzerStructLogs.get()
    const traceLogs = this.dataLoader.analyzerTraceLogs.get()
    const contractsInstructions = this.dataLoader.analyzerContractData.getAll('instructions')
    const contractSourceFiles = this.dataLoader.analyzerContractData.getAll('sourceFiles')
    const contractAbis = this.dataLoader.inputContractData.getAll('applicationBinaryInterface')
    const functionsDebugData = this.dataLoader.inputContractData.getAll('functionDebugData')

    for (const traceLog of traceLogs) {
      console.log('createFunctionsList => traceLog: ', traceLog.callTypeData.functionFragment.name)

      const contractInstruction = contractsInstructions[traceLog.address]
      const contractSourceFile = contractSourceFiles[traceLog.address]
      const contractAbi = new Interface(contractAbis[traceLog.address])
      const functionDebugData = functionsDebugData[traceLog.address]

      console.log('createFunctionsList => functionDebugData: ', functionDebugData)

      console.log('createFunctionsList => contractAbis: ', contractAbis)
      console.log('createFunctionsList => contractAbi: ', contractAbi)

      console.log(
        'createFunctionsList => contractAbi: ',
        contractAbi.fragments.reduce((accumulator, abi) => {
          if (abi.type !== 'constructor') {
            accumulator[abi.format('sighash')] = abi
          }
          return accumulator
        }, {}),
      )

      // console.log(
      //   'createFunctionsList => contractInstruction: ',
      //   Object.values(contractInstruction).map((instruction) => instruction.jumpType),
      // )

      const structLogsRange = selectFunctionBlockContextForLog(structlogs, traceLog)
      const jumpDestStructLogs = structLogsRange.filter((log) => contractInstruction[log.pc]?.isSourceFunction)

      console.log('createFunctionsList => jumpDestStructLogs: ', jumpDestStructLogs)
      jumpDestStructLogs.forEach((log) => {
        const instruction = contractInstruction[log.pc]

        if (!instruction) return

        const sourceFile = contractSourceFile[instruction.fileId].content
        const sourceLine = sourceFile.split('\n')[instruction.startCodeLine]

        console.log('createFunctionsList => sourceLine: ', `${log.pc.toString(16)}|${log.op}|${instruction.jumpType}\n${sourceLine}`)
      })
    }
  }

  public runFullAnalysis() {
    this.createContractBaseData()
    this.createSourceFiles()

    this.disassembleTransactionBytecodes()

    this.traceCreator.processTransactionStructLogs()

    this.sourceLineParser.createContractsInstructions()

    this.createFunctionsList()

    return this.dataLoader.getAnalyzerAnalysisOutput()
  }

  public getContractsRawData(): TAnalyzerContractsRawData {
    const contractAddresses = this.dataLoader.getAddressesList()
    const contractsRawData: TAnalyzerContractsRawData = {}

    for (const address of contractAddresses) {
      const applicationBinaryInterface = this.dataLoader.inputContractData.get(address, 'applicationBinaryInterface')
      const sourceMap = this.dataLoader.inputContractData.get(address, 'sourceMap')
      const bytecode = this.dataLoader.inputContractData.get(address, 'bytecode')
      const etherscanBytecode = this.dataLoader.inputContractData.get(address, 'etherscanBytecode')

      contractsRawData[address] = {
        sourceMap,
        etherscanBytecode,
        bytecode,
        applicationBinaryInterface,
        address,
      }
    }

    return contractsRawData
  }

  public getTraceLogsContractAddresses(): string[] {
    return this.traceCreator.getContractAddressesInTransaction()
  }
}
