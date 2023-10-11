export enum Paths {
  TEMP_EXECS = 'tempExecs.json',
  RESULTS = 'results',
  RESULTS_TMP = 'results/tmp',
  RESULTS_PERSISTED = 'results/persisted',
  TRANSACTIONS = 'transactions',
  CONTRACTS = 'contracts',
}

export enum DefaultPaths {
  TEMP_EXECS = 'tempExecs.json',
  RESULTS = 'results',
  RESULTS_TMP = 'results/tmp',
  RESULTS_PERSISTED = 'results/persisted',
}
export enum TransactionPaths {
  TRANSACTIONS = 'transactions',
  TRANSACTION_TRACE = 'transactionTrace.json',
  TRANSACTION_INFO = 'transactionInfo.json',
}
export enum ContractPaths {
  CONTRACTS = 'contracts',
  BYTECODE = 'bytecode.json',
  SOURCE_CODES = 'sourceCodes.json',
}

export const generateTransactionPaths = (transactionHash: string) => ({
  transactionTracePath: `${Paths.RESULTS_PERSISTED}/${Paths.TRANSACTIONS}/${transactionHash}/${TransactionPaths.TRANSACTION_TRACE}`,
  transactionRootPath: `${Paths.RESULTS_PERSISTED}/${Paths.TRANSACTIONS}/${transactionHash}`,
  transactionInfoPath: `${Paths.RESULTS_PERSISTED}/${Paths.TRANSACTIONS}/${transactionHash}/${TransactionPaths.TRANSACTION_INFO}`,
})

export const generateContractPaths = (contractAddress: string) => ({
  sourceCodesPath: `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/${ContractPaths.SOURCE_CODES}`,
  contractRootPath: `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}`,
  bytecodePath: `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/${ContractPaths.BYTECODE}`,
})
