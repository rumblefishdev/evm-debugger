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

  private getInputContractData<T extends keyof TInputContractData>(contractAddress: string, key: T): TInputContractData[T] | undefined {
    if (!this.inputData.contracts[contractAddress]) return undefined
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

  public isContractVerified(contractAddress: string) {
    // TODO: remove this when support for precompiled contracts is added
    if (
      contractAddress === '0x0000000000000000000000000000000000000001' ||
      contractAddress === '0x0000000000000000000000000000000000000002' ||
      contractAddress === '0x0000000000000000000000000000000000000003' ||
      contractAddress === '0x0000000000000000000000000000000000000004' ||
      contractAddress === '0x0000000000000000000000000000000000000005' ||
      contractAddress === '0x0000000000000000000000000000000000000006' ||
      contractAddress === '0x0000000000000000000000000000000000000007' ||
      contractAddress === '0x0000000000000000000000000000000000000008' ||
      contractAddress === '0x0000000000000000000000000000000000000009' ||
      contractAddress === '0x000000000000000000000000000000000000000a'
    )
      return false
    return Boolean(this.inputContractData.get(contractAddress, 'sourceData') || undefined)
  }

  private setAnalyzerContractData<T extends keyof TAnalyzerContractData>(contractAddress: string, key: T, value: TAnalyzerContractData[T]) {
    this.analyzerData.contracts[contractAddress][key] = value
  }

  private getAnalyzerContractData<T extends keyof TAnalyzerContractData>(
    contractAddress: string,
    key: T,
  ): TAnalyzerContractData[T] | undefined {
    if (!this.inputData.contracts[contractAddress]) return undefined
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
    set: (structLogs: TRawStructLog[]) =>
      (this.inputData.structLogs = structLogs.map((structLog, index) => ({
        ...structLog,
        index,
        dynamicGasCost: structLog.gas - (structLogs[index + 1]?.gas || 0) - structLog.gasCost,
      }))),
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

  public analyzerSighashes = {
    set: (sighashes: TDataLoaderAnalyzerData['sighashes']) => (this.analyzerData.sighashes = sighashes),
    get: () => this.analyzerData.sighashes,
  }

  public analyzerRuntimeFunctionsList = {
    set: (runtimeFunctionsList: TDataLoaderAnalyzerData['runtimeFunctionsList']) =>
      (this.analyzerData.runtimeFunctionsList = runtimeFunctionsList),
    get: () => this.analyzerData.runtimeFunctionsList,
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
      traceLogsFunctionsStack: this.analyzerRuntimeFunctionsList.get(),
      traceLogs: this.analyzerTraceLogs.get(),
      structLogs: this.analyzerStructLogs.get(),
      sighashes: this.analyzerSighashes.get(),
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
      contractsInstructions: Object.values(this.analyzerData.contracts).reduce<TAnalyzerAnalysisOutput['contractsInstructions']>(
        (accumulator, { address, instructions }) => {
          accumulator[address] = { instructions, address }
          return accumulator
        },
        {},
      ),
      contractsDisassembledBytecodes: Object.values(this.analyzerData.contracts).reduce<
        TAnalyzerAnalysisOutput['contractsDisassembledBytecodes']
      >((accumulator, { address, disassembledEtherscanBytecode }) => {
        accumulator[address] = { disassembledBytecode: disassembledEtherscanBytecode, address }
        return accumulator
      }, {}),
      contractsBaseData: Object.values(this.analyzerData.contracts).reduce<TAnalyzerAnalysisOutput['contractsBaseData']>(
        (accumulator, { address, contractBaseData }) => {
          accumulator[address] = contractBaseData
          return accumulator
        },
        {},
      ),
    }
  }
}
