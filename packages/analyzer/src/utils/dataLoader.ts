import type { TDataLoaderRawInputData, TDataLoaderOutputData, TAnalyzerAnalysisOutput } from '@evm-debuger/types'

export class DataLoader {
  private inputRawData: TDataLoaderRawInputData
  private outputData: TDataLoaderOutputData

  private setInputRawContractData<T extends keyof TDataLoaderRawInputData['contracts'][string]>(
    contractAddress: string,
    key: T,
    value: TDataLoaderRawInputData['contracts'][string][T],
  ) {
    this.inputRawData.contracts[contractAddress][key] = value
  }

  private getInputRawContractData<T extends keyof TDataLoaderRawInputData['contracts'][string]>(
    contractAddress: string,
    key: T,
  ): TDataLoaderRawInputData['contracts'][string][T] {
    return this.inputRawData.contracts[contractAddress][key]
  }

  private getAllInputRawContractData<T extends keyof TDataLoaderRawInputData['contracts'][string]>(key: T) {
    return Object.keys(this.inputRawData.contracts).reduce((accumulator, contractAddress) => {
      accumulator[contractAddress] = this.getInputRawContractData(contractAddress, key)
      return accumulator
    }, {} as Record<string, TDataLoaderRawInputData['contracts'][string][T]>)
  }

  private setOutputContractData<T extends keyof TDataLoaderOutputData['contracts'][string]>(
    contractAddress: string,
    key: T,
    value: TDataLoaderOutputData['contracts'][string][T],
  ) {
    this.outputData.contracts[contractAddress][key] = value
  }

  private getOutputContractData<T extends keyof TDataLoaderOutputData['contracts'][string]>(
    contractAddress: string,
    key: T,
  ): TDataLoaderOutputData['contracts'][string][T] {
    return this.outputData.contracts[contractAddress][key]
  }

  private getAllOutputContractData<T extends keyof TDataLoaderOutputData['contracts'][string]>(key: T) {
    return Object.keys(this.outputData.contracts).reduce((accumulator, contractAddress) => {
      accumulator[contractAddress] = this.getOutputContractData(contractAddress, key)
      return accumulator
    }, {} as Record<string, TDataLoaderOutputData['contracts'][string][T]>)
  }

  public inputRawTransactionData = {
    set: (transactionInfo: TDataLoaderRawInputData['transactionInfo']) => (this.inputRawData.transactionInfo = transactionInfo),
    get: () => this.inputRawData.transactionInfo,
  }

  public inputRawStructlogs = {
    set: (structLogs: TDataLoaderRawInputData['structLogs']) => (this.inputRawData.structLogs = structLogs),
    get: () => this.inputRawData.structLogs,
  }

  public outputStructLogs = {
    set: (structLogs: TDataLoaderOutputData['structLogs']) => (this.outputData.structLogs = structLogs),
    get: () => this.outputData.structLogs,
  }

  public outputTransactionInfo = {
    set: (transactionInfo: TDataLoaderOutputData['transactionInfo']) => (this.outputData.transactionInfo = transactionInfo),
    get: () => this.outputData.transactionInfo,
  }

  public contractData = {
    set: this.setInputRawContractData,
    getAll: this.getAllInputRawContractData,
    get: this.getInputRawContractData,
  }

  public outputContractData = {
    set: this.setOutputContractData,
    getAll: this.getAllOutputContractData,
    get: this.getOutputContractData,
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
