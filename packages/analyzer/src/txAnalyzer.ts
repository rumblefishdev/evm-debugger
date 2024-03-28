import type { TAnalyzerContractBaseData, TAnalyzerContractsRawData } from '@evm-debuger/types'

import { DataLoader } from './utils/dataLoader'
import { EVMMachine } from './utils/evmMachine'
import { parseSourceCode } from './helpers/parseSourceCodes'
import { TraceCreator } from './utils/traceCreator'
import { SourceLineParser } from './utils/sourceLineParser'
import { FunctionManager } from './utils/functionManager'

export class TxAnalyzer {
  private readonly evmMachine = new EVMMachine()
  public readonly dataLoader: DataLoader = new DataLoader()
  private readonly traceCreator = new TraceCreator(this.dataLoader)
  private readonly sourceLineParser = new SourceLineParser(this.dataLoader)
  private readonly functionManager = new FunctionManager(this.dataLoader)

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
      const isVerified = this.dataLoader.isContractVerified(address)
      if (!isVerified) continue

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
      if (!sourceData) {
        this.dataLoader.analyzerContractData.set(address, 'contractBaseData', { address })
        continue
      }
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

  public runFullAnalysis() {
    this.createContractBaseData()
    this.disassembleTransactionBytecodes()

    this.traceCreator.processTransactionStructLogs()

    this.createSourceFiles()

    this.sourceLineParser.createContractsInstructions()

    this.functionManager.createFunctionsDictionary()

    this.functionManager.createFunctionsStackTrace()

    this.functionManager.decodeFunctionsParameters()

    return this.dataLoader.getAnalyzerAnalysisOutput()
  }

  public runTestAnalysis() {
    this.createContractBaseData()
    this.createSourceFiles()

    this.disassembleTransactionBytecodes()

    this.traceCreator.processTransactionStructLogs()

    this.sourceLineParser.createContractsInstructions()

    return this.dataLoader.getAnalyzerAnalysisOutput()
  }

  public getTraceLogsContractAddresses(): string[] {
    return this.traceCreator.getContractAddressesInTransaction()
  }
}
