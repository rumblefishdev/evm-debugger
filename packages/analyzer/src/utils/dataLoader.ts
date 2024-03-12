import type {
  TIndexedStructLog,
  TRawStructLog,
  TTransactionInfo,
  TContractsData,
  TContractData,
  TAbi,
  TParseSourceCodeOutput,
} from '@evm-debuger/types'

export class DataLoader {
  private structLogs: TIndexedStructLog[] = []
  private transactionInfo: TTransactionInfo | null
  private contractsData: TContractsData = {}

  public loadTransactionInfo(transactionInfo: TTransactionInfo) {
    this.transactionInfo = transactionInfo
  }
  public loadStructlogs(structLogs: TRawStructLog[]) {
    this.structLogs = structLogs.map((log, index) => ({ ...log, index }))
  }

  public initializeNewContracts = (addresses: string[]) => {
    addresses.forEach((address) => {
      this.contractsData[address] = { address } as TContractData
    })
  }

  public loadContractBytecode(address: string, bytecode: string) {
    this.contractsData[address] = { ...this.contractsData[address], bytecode }
  }

  public loadContractName(address: string, name: string) {
    this.contractsData[address] = { ...this.contractsData[address], name }
  }

  public loadContractAbi(address: string, applicationBinaryInterface: TAbi) {
    this.contractsData[address] = { ...this.contractsData[address], applicationBinaryInterface }
  }

  public loadContractSourceMap(address: string, sourceMap: string) {
    this.contractsData[address] = { ...this.contractsData[address], sourceMap }
  }

  public loadContractEtherscanBytecode(address: string, etherscanBytecode: string) {
    this.contractsData[address] = { ...this.contractsData[address], etherscanBytecode }
  }

  public loadContractFiles(address: string, files: TParseSourceCodeOutput) {
    this.contractsData[address] = { ...this.contractsData[address], files }
  }

  public loadContractYulFile(address: string, yulFileContent: string) {
    this.contractsData[address] = { ...this.contractsData[address], yulFileContent }
  }

  public loadContractYulTree(address: string, yulTree: string) {
    this.contractsData[address] = { ...this.contractsData[address], yulTree }
  }

  public getStructLogs() {
    return this.structLogs
  }

  public getTransactionInfo() {
    return this.transactionInfo
  }

  public getContractsData() {
    return this.contractsData
  }

  public getContractData(address: string) {
    return this.contractsData[address]
  }
}
