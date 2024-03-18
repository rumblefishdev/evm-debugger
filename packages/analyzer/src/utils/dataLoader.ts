import type {
  TDataLoaderInputData,
  TDataLoaderAnalyzerData,
  TAnalyzerAnalysisOutput,
  TRawStructLog,
  TInputContractData,
  TAnalyzerContractData,
} from '@evm-debuger/types'

export class DataLoader {
  private inputData: TDataLoaderInputData
  private analyzerData: TDataLoaderAnalyzerData

  private setInputContractData<T extends keyof TInputContractData>(contractAddress: string, key: T, value: TInputContractData[T]) {
    this.inputData.contracts[contractAddress][key] = value
  }

  private getInputContractData<T extends keyof TInputContractData>(contractAddress: string, key: T): TInputContractData[T] {
    return this.inputData.contracts[contractAddress][key]
  }

  private getAllInputContractData<T extends keyof TInputContractData>(key: T) {
    return Object.keys(this.inputData.contracts).reduce((accumulator, contractAddress) => {
      accumulator[contractAddress] = this.getInputContractData(contractAddress, key)
      return accumulator
    }, {} as Record<string, TInputContractData[T]>)
  }

  public inputContractData = {
    set: this.setInputContractData,
    getAll: this.getAllInputContractData,
    get: this.getInputContractData,
  }

  private setAnalyzerContractData<T extends keyof TAnalyzerContractData>(contractAddress: string, key: T, value: TAnalyzerContractData[T]) {
    this.analyzerData.contracts[contractAddress][key] = value
  }

  private getAnalyzerContractData<T extends keyof TAnalyzerContractData>(contractAddress: string, key: T): TAnalyzerContractData[T] {
    return this.analyzerData.contracts[contractAddress][key]
  }

  private getAllAnalayzerContractsData<T extends keyof TAnalyzerContractData>(key: T) {
    return Object.keys(this.analyzerData.contracts).reduce((accumulator, contractAddress) => {
      accumulator[contractAddress] = this.getAnalyzerContractData(contractAddress, key)
      return accumulator
    }, {} as Record<string, TAnalyzerContractData[T]>)
  }

  public analyzerContractData = {
    set: this.setAnalyzerContractData.bind(this),
    getAll: this.getAllAnalayzerContractsData.bind(this),
    get: this.getAnalyzerContractData.bind(this),
  }

  constructor() {
    this.inputData = { contracts: {} } as TDataLoaderInputData
    this.analyzerData = { contracts: {} } as TDataLoaderAnalyzerData

    this.inputContractData = {
      set: this.setInputContractData.bind(this),
      getAll: this.getAllInputContractData.bind(this),
      get: this.getInputContractData.bind(this),
    }
  }

  public inputTransactionData = {
    set: (transactionInfo: TDataLoaderInputData['transactionInfo']) => (this.inputData.transactionInfo = transactionInfo),
    get: () => this.inputData.transactionInfo,
  }

  public inputStructlogs = {
    set: (structLogs: TRawStructLog[]) => (this.inputData.structLogs = structLogs.map((structLog, index) => ({ ...structLog, index }))),
    get: () => this.inputData.structLogs,
  }

  public analyzerStructLogs = {
    set: (structLogs: TDataLoaderAnalyzerData['structLogs']) => (this.analyzerData.structLogs = structLogs),
    get: () => this.analyzerData.structLogs,
  }

  public analyzerTransactionInfo = {
    set: (transactionInfo: TDataLoaderAnalyzerData['transactionInfo']) => (this.analyzerData.transactionInfo = transactionInfo),
    get: () => this.analyzerData.transactionInfo,
  }

  public analyzerTraceLogs = {
    set: (traceLogs: TDataLoaderAnalyzerData['traceLogs']) => (this.analyzerData.traceLogs = traceLogs),
    get: () => this.analyzerData.traceLogs,
  }

  public getAllInputContractsData() {
    return this.inputData.contracts
  }

  public getAllAnalyzerContractsData() {
    return this.analyzerData.contracts
  }

  public setEmptyContracts(contractAddresses: string[]) {
    this.inputData.contracts = contractAddresses.reduce<TDataLoaderInputData['contracts']>((accumulator, address) => {
      accumulator[address] = { address }
      return accumulator
    }, {})
    this.analyzerData.contracts = contractAddresses.reduce<TDataLoaderAnalyzerData['contracts']>((accumulator, address) => {
      accumulator[address] = { address }
      return accumulator
    }, {})
  }

  public getAddressesList() {
    return Object.keys(this.inputData.contracts)
  }

  public getAnalyzerAnalysisOutput(): TAnalyzerAnalysisOutput {
    return {
      transactionInfo: this.analyzerTransactionInfo.get(),
      traceLogs: this.analyzerTraceLogs.get(),
      structLogs: this.analyzerStructLogs.get(),
      contractsStructLogsPerLine: Object.values(this.analyzerData.contracts).reduce<TAnalyzerAnalysisOutput['contractsStructLogsPerLine']>(
        (accumulator, { address, structlogsPerStartLine }) => {
          accumulator[address] = { structlogsPerStartLine, address }
          return accumulator
        },
        {},
      ),
      contractsSourceFiles: Object.values(this.analyzerData.contracts).reduce<TAnalyzerAnalysisOutput['contractsSourceFiles']>(
        (accumulator, { address, sourceFiles }) => {
          accumulator[address] = { sourceFiles, address }
          return accumulator
        },
        {},
      ),
      contractsSettings: Object.values(this.analyzerData.contracts).reduce<TAnalyzerAnalysisOutput['contractsSettings']>(
        (accumulator, { address, contractSettings }) => {
          accumulator[address] = { address, ...contractSettings }
          return accumulator
        },
        {},
      ),
      contractsInstructions: Object.values(this.analyzerData.contracts).reduce<TAnalyzerAnalysisOutput['contractsInstructions']>(
        (accumulator, { address, instructions }) => {
          accumulator[address] = { instructions, address }
          return accumulator
        },
        {},
      ),
      contractsDisassembledBytecodes: Object.values(this.analyzerData.contracts).reduce<
        TAnalyzerAnalysisOutput['contractsDisassembledBytecodes']
      >((accumulator, { address, disassembledBytecode }) => {
        accumulator[address] = { disassembledBytecode, address }
        return accumulator
      }, {}),
      contractsBaseData: Object.values(this.analyzerData.contracts).reduce<TAnalyzerAnalysisOutput['contractsBaseData']>(
        (accumulator, { address, contractBaseData }) => {
          accumulator[address] = { ...contractBaseData, address }
          return accumulator
        },
        {},
      ),
    }
  }
}
