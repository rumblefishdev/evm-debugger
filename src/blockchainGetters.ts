import { network } from 'hardhat'
import { TTransactionRootLog, TTransactionTraceResult } from './types'

export const getTransactionByHash = async (transactionHash: string) => {
    return (await network.provider.send('eth_getTransactionByHash', [transactionHash])) as TTransactionRootLog
}

export const getTransactionTrace = async (transactionHash: string): Promise<TTransactionTraceResult> => {
    return await network.provider.send('debug_traceTransaction', [transactionHash, { tracer: 'callTracer' }])
}
export const getTransactionReceipt = async (transactionHash: string) => {
    return await network.provider.send('eth_getTransactionReceipt', [transactionHash])
}

export const getContractCode = async (contractAddress: string) => {
    return await network.provider.send('eth_getCode', [contractAddress])
}
