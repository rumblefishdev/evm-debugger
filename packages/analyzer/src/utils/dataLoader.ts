import type {
  TDataLoaderRawInputData,
  TDataLoaderOutputData,
  TRawContractData,
  TContractBaseData,
  TContractData,
  TAnalyzerAnalysisOutput,
} from '@evm-debuger/types'

export class DataLoader {
  private inputRawData: TDataLoaderRawInputData
  private outputData: TDataLoaderOutputData

  private setInputRawTransctionInfo(transactionInfo: TDataLoaderRawInputData['transactionInfo']) {
    this.inputRawData.transactionInfo = transactionInfo
  }

  private getInputRawTransactionData(): TDataLoaderRawInputData['transactionInfo'] {
    return this.inputRawData.transactionInfo
  }

  private setInputRawStructlogs(structLogs: TDataLoaderRawInputData['structLogs']) {
    this.inputRawData.structLogs = structLogs
  }

  private getInputRawStructlogs(): TDataLoaderRawInputData['structLogs'] {
    return this.inputRawData.structLogs
  }

  private setInputRawSourceMap(address: string, sourceMap: TRawContractData['sourceMap']) {
    this.inputRawData.contracts[address] = { ...this.inputRawData.contracts[address], sourceMap }
  }

  private getInputRawSourceMap(address: string): TRawContractData['sourceMap'] {
    return this.inputRawData.contracts[address].sourceMap
  }

  private setInputRawBytecode(address: string, bytecode: TRawContractData['bytecode']) {
    this.inputRawData.contracts[address] = { ...this.inputRawData.contracts[address], bytecode }
  }

  private getInputRawBytecode(address: string): TRawContractData['bytecode'] {
    return this.inputRawData.contracts[address].bytecode
  }

  private setInputRawEtherscanBytecode(address: string, etherscanBytecode: TRawContractData['etherscanBytecode']) {
    this.inputRawData.contracts[address] = { ...this.inputRawData.contracts[address], etherscanBytecode }
  }

  private getInputRawEtherscanBytecode(address: string): TRawContractData['etherscanBytecode'] {
    return this.inputRawData.contracts[address].etherscanBytecode
  }

  private setInputRawApplicationBinaryInterface(
    address: string,
    applicationBinaryInterface: TRawContractData['applicationBinaryInterface'],
  ) {
    this.inputRawData.contracts[address] = { ...this.inputRawData.contracts[address], applicationBinaryInterface }
  }

  private getInputRawApplicationBinaryInterface(address: string): TRawContractData['applicationBinaryInterface'] {
    return this.inputRawData.contracts[address].applicationBinaryInterface
  }

  private setInputRawSourceCode(address: string, sourceCode: TRawContractData['sourceCode']) {
    this.inputRawData.contracts[address] = { ...this.inputRawData.contracts[address], sourceCode }
  }

  private getInputRawSourceCode(address: string): TRawContractData['sourceCode'] {
    return this.inputRawData.contracts[address].sourceCode
  }

  private setInputRawYulSource(address: string, yulSource: TRawContractData['yulSource']) {
    this.inputRawData.contracts[address] = { ...this.inputRawData.contracts[address], yulSource }
  }

  private getInputRawYulSource(address: string): TRawContractData['yulSource'] {
    return this.inputRawData.contracts[address].yulSource
  }

  private setInputRawYulTree(address: string, yulTree: TRawContractData['yulTree']) {
    this.inputRawData.contracts[address] = { ...this.inputRawData.contracts[address], yulTree }
  }

  private getInputRawYulTree(address: string): TRawContractData['yulTree'] {
    return this.inputRawData.contracts[address].yulTree
  }

  private setInputRawSourceFilesOrder(address: string, sourceFilesOrder: TRawContractData['sourceFilesOrder']) {
    this.inputRawData.contracts[address] = { ...this.inputRawData.contracts[address], sourceFilesOrder }
  }

  private getInputRawSourceFilesOrder(address: string): TRawContractData['sourceFilesOrder'] {
    return this.inputRawData.contracts[address].sourceFilesOrder
  }

  private setOutputStructLogs(structLogs: TDataLoaderOutputData['structLogs']) {
    this.outputData.structLogs = structLogs
  }

  private getOutputStructLogs(): TDataLoaderOutputData['structLogs'] {
    return this.outputData.structLogs
  }

  private setOutputTransactionInfo(transactionInfo: TDataLoaderOutputData['transactionInfo']) {
    this.outputData.transactionInfo = transactionInfo
  }

  private getOutputTransactionInfo(): TDataLoaderOutputData['transactionInfo'] {
    return this.outputData.transactionInfo
  }

  private setOutputContractBaseData(contracts: TContractBaseData[]) {
    this.outputData.contracts = contracts.reduce<TDataLoaderOutputData['contracts']>((accumulator, contract) => {
      accumulator[contract.address] = contract
      return accumulator
    }, {})
  }

  private getOutputContractBaseData(address: string): TContractBaseData {
    const contract = this.outputData.contracts[address]
    return { name: contract.name, address: contract.address }
  }

  private setOutputContractSettings(address: string, contractSettings: TContractData['contractSettings']) {
    this.outputData.contracts[address] = { ...this.outputData.contracts[address], contractSettings }
  }

  private getOutputContractSettings(address: string): TContractData['contractSettings'] {
    return this.outputData.contracts[address].contractSettings
  }

  private setOutputDisassembledBytecode(address: string, disassembledBytecode: TContractData['disassembledBytecode']) {
    this.outputData.contracts[address] = { ...this.outputData.contracts[address], disassembledBytecode }
  }

  private getOutputDisassembledBytecode(address: string): TContractData['disassembledBytecode'] {
    return this.outputData.contracts[address].disassembledBytecode
  }

  private setOutputDisassembledEtherscanBytecode(
    address: string,
    disassembledEtherscanBytecode: TContractData['disassembledEtherscanBytecode'],
  ) {
    this.outputData.contracts[address] = { ...this.outputData.contracts[address], disassembledEtherscanBytecode }
  }

  private getOutputDisassembledEtherscanBytecode(address: string): TContractData['disassembledEtherscanBytecode'] {
    return this.outputData.contracts[address].disassembledEtherscanBytecode
  }

  private setOutputSourceFiles(address: string, sourceFiles: TContractData['sourceFiles']) {
    this.outputData.contracts[address] = { ...this.outputData.contracts[address], sourceFiles }
  }

  private getOutputSourceFiles(address: string): TContractData['sourceFiles'] {
    return this.outputData.contracts[address].sourceFiles
  }

  private getAllContractsAddresses(): string[] {
    return Object.keys(this.inputRawData.contracts)
  }

  public inputRawTransactionData = {
    set: this.setInputRawTransctionInfo,
    get: this.getInputRawTransactionData,
  }

  public inputRawStructlogs = {
    set: this.setInputRawStructlogs,
    get: this.getInputRawStructlogs,
  }

  public inputRawSourceMap = {
    set: this.setInputRawSourceMap,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getInputRawSourceMap(address)
        return accumulator
      }, {}),
    get: this.getInputRawSourceMap,
  }

  public inputRawBytecode = {
    set: this.setInputRawBytecode,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getInputRawBytecode(address)
        return accumulator
      }, {}),
    get: this.getInputRawBytecode,
  }

  public inputRawEtherscanBytecode = {
    set: this.setInputRawEtherscanBytecode,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getInputRawEtherscanBytecode(address)
        return accumulator
      }, {}),
    get: this.getInputRawEtherscanBytecode,
  }

  public inputRawApplicationBinaryInterface = {
    set: this.setInputRawApplicationBinaryInterface,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getInputRawApplicationBinaryInterface(address)
        return accumulator
      }, {}),
    get: this.getInputRawApplicationBinaryInterface,
  }

  public inputRawSourceCode = {
    set: this.setInputRawSourceCode,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getInputRawSourceCode(address)
        return accumulator
      }, {}),
    get: this.getInputRawSourceCode,
  }

  public inputRawYulSource = {
    set: this.setInputRawYulSource,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getInputRawYulSource(address)
        return accumulator
      }, {}),
    get: this.getInputRawYulSource,
  }

  public inputRawYulTree = {
    set: this.setInputRawYulTree,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getInputRawYulTree(address)
        return accumulator
      }, {}),
    get: this.getInputRawYulTree,
  }

  public inputRawSourceFilesOrder = {
    set: this.setInputRawSourceFilesOrder,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getInputRawSourceFilesOrder(address)
        return accumulator
      }, {}),
    get: this.getInputRawSourceFilesOrder,
  }

  public outputStructLogs = {
    set: this.setOutputStructLogs,
    get: this.getOutputStructLogs,
  }

  public outputTransactionInfo = {
    set: this.setOutputTransactionInfo,
    get: this.getOutputTransactionInfo,
  }

  public outputContractBaseData = {
    set: this.setOutputContractBaseData,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getOutputContractBaseData(address)
        return accumulator
      }, {}),
    get: this.getOutputContractBaseData,
  }

  public outputContractSettings = {
    set: this.setOutputContractSettings,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getOutputContractSettings(address)
        return accumulator
      }, {}),
    get: this.getOutputContractSettings,
  }

  public outputDisassembledBytecode = {
    set: this.setOutputDisassembledBytecode,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getOutputDisassembledBytecode(address)
        return accumulator
      }, {}),
    get: this.getOutputDisassembledBytecode,
  }

  public outputDisassembledEtherscanBytecode = {
    set: this.setOutputDisassembledEtherscanBytecode,
    getAll: () =>
      this.getAllContractsAddresses().reduce((accumulator, address) => {
        accumulator[address] = this.getOutputDisassembledEtherscanBytecode(address)
        return accumulator
      }, {}),
    get: this.getOutputDisassembledEtherscanBytecode,
  }

  public outputSourceFiles = {
    set: this.setOutputSourceFiles,
    getAll: this.getAllContractsAddresses().reduce((accumulator, address) => {
      accumulator[address] = this.getOutputSourceFiles(address)
      return accumulator
    }, {}),
    get: this.getOutputSourceFiles,
  }

  public setEmptyContracts(contractAddresses: string[]) {
    this.inputRawData.contracts = contractAddresses.reduce<TDataLoaderRawInputData['contracts']>((accumulator, address) => {
      accumulator[address] = { address }
      return accumulator
    }, {})
    this.outputData.contracts = contractAddresses.reduce<TDataLoaderOutputData['contracts']>((accumulator, address) => {
      accumulator[address] = { address }
      return accumulator
    }, {})
  }

  public getAnalyzerAnalysisOutput(): TAnalyzerAnalysisOutput {
    return {
      transactionInfo: this.outputTransactionInfo.get(),
      structLogs: this.outputStructLogs.get(),
      contractsSettings: Object.values(this.outputData.contracts).reduce<TAnalyzerAnalysisOutput['contractsSettings']>(
        (accumulator, { address, contractSettings }) => {
          accumulator[address] = { address, ...contractSettings }
          return accumulator
        },
        {},
      ),
      contractsDisassembledBytecodes: Object.values(this.outputData.contracts).reduce<
        TAnalyzerAnalysisOutput['contractsDisassembledBytecodes']
      >((accumulator, { address, disassembledBytecode }) => {
        accumulator[address] = { disassembledBytecode, address }
        return accumulator
      }, {}),
      contractsBaseData: Object.values(this.outputData.contracts).reduce<TAnalyzerAnalysisOutput['contractsBaseData']>(
        (accumulator, { address, name }) => {
          accumulator[address] = { name, address }
          return accumulator
        },
        {},
      ),
    }
  }
}
