import { IStructLog } from './structLogs'

export type TStorage = Array<{ [key: string]: string }>

export type TLoadedStorage = Array<{ key: string; value: string; index: number }>
export type TChangedStorage = Array<{ key: string; initialValue: string; updatedValue: string; index: number }>
export type TReturnedStorage = Array<{ key: string; value: string }>

export type TStorageLogs = {
    loadedStorage: TLoadedStorage
    returnedStorage: TReturnedStorage
    changedStorage: TChangedStorage
}

export type TTransactionInfo = {
    blockHash: string
    blockNumber: string
    from: string
    gas: string
    hash: string
    input: string
    nonce: string
    to: string
    transactionIndex: string
    value: string
    v: string
    r: string
    s: string
    type: string
    accessList: string
    chainId: string
    gasPrice: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
}

export type TTransactionTrace = {
    jsonrpc: string
    id: number
    result: TTransactionTraceResult
}

export type TTransactionTraceResult = {
    gas: number
    failed: boolean
    returnValue: string
    structLogs: IStructLog[]
}

export interface TDataProvider {
    getTransactionTrace(transactionHash: string): Promise<TTransactionTraceResult>
    getTransactionByHash(transactionHash: string): Promise<TTransactionInfo>
    getContractCode(address: string): Promise<string>
    fetchAbiCode(address: string): Promise<string>
}
