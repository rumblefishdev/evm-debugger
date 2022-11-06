import { network } from 'hardhat'
import { IDataProvider, TTransactionRootLog, TTransactionTraceResult } from '../typings/types'
import fetch from 'node-fetch'

export const getTransactionByHash = async (transactionHash: string): Promise<TTransactionRootLog> => {
    return await network.provider.send('eth_getTransactionByHash', [transactionHash])
}

export const getTransactionTrace = async (transactionHash: string): Promise<TTransactionTraceResult> => {
    return await network.provider.send('debug_traceTransaction', [transactionHash, { tracer: 'callTracer' }])
}
export const getTransactionReceipt = async (transactionHash: string) => {
    return await network.provider.send('eth_getTransactionReceipt', [transactionHash])
}

export const getContractCode = async (address: string): Promise<string> => {
    return await network.provider.send('eth_getCode', [address])
}
export const fetchAbiCode = async (address: string): Promise<string> => {
    const response = await fetch(
        `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=Y8XNE3W519FITZJRPRGYY4ZEII2IV3W73F`
    )
    return await response.text()
}

export const defaultDataProvider: IDataProvider = {
    getTransactionByHash,
    getTransactionTrace,
    fetchAbiCode,
    getContractCode,
}
