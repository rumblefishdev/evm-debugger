import type { TAnalyzerContractBaseData, TAnalyzerContractSettings } from '@evm-debuger/types'

import { DataLoader } from './utils/dataLoader'
import { EVMMachine } from './utils/evmMachine'
import { parseSourceCode } from './helpers/parseSourceCodes'
import { TraceCreator } from './utils/traceCreator'
import { SourceLineParser } from './utils/sourceLineParser'

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

    this.sourceLineParser.createContractsInstructions()

    const payload = this.dataLoader.getAnalyzerAnalysisOutput()

    console.log('Analyzer finished', payload)

    return payload
  }

  public getTraceLogsContractAddresses(): string[] {
    return this.traceCreator.getContractAddressesInTransaction()
  }
}
