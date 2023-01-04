import type ethers from 'ethers'
import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'
import { TransactionTracResponseStatus } from '@evm-debuger/types'

import { transactionTraceProviderUrl } from '../../config'

import type { IAbiProvider, IBytecodeProvider, IStructLogProvider, ITxInfoProvider } from './analyzer.types'

export class StaticStructLogProvider implements IStructLogProvider {
  constructor(private structLog: IStructLog[]) {}

  getStructLog() {
    return Promise.resolve(this.structLog)
  }
}

export class StaticTxInfoProvider implements ITxInfoProvider {
  constructor(private txInfo: TTransactionInfo) {}

  getTxInfo() {
    return Promise.resolve(this.txInfo)
  }
}

export class EtherscanAbiFetcher implements IAbiProvider {
  constructor(private etherscanUrl: string, private etherscanKey: string) {}

  async getAbi(address: string) {
    const response = await fetch(`${this.etherscanUrl}/api?module=contract&action=getabi&address=${address}&apikey=${this.etherscanKey}`)
    if (response.status !== 200) throw new Error(`Etherscan returned ${response.status} response code`)

    const asJson = await response.json()
    if (asJson.status !== '1') throw new Error(`${address} is not verified on Etherscan`)

    return JSON.parse(asJson.result)
  }
}

export const getTransactionTraceFromS3 = (transactionTraceLocation) => {
  return transactionTraceLocation
}

export class TransactionTraceFetcher implements IStructLogProvider {
  constructor(private transactionTraceProviderUrl: string, public hash: string, private chainId: number) {}

  // eslint-disable-next-line id-denylist
  async getStructLog(): Promise<IStructLog[]> {
    let transactionTraceJson
    return new Promise(function (resolve) {
      const transactionTraceInterval = setInterval(async () => {
        const response = await fetch(`${this.transactionTraceProviderUrl}/analyzerData/${this.hash}/${this.chainId}`)
        const asJson = await response.json()
        console.log('INVOKE:', asJson)

        if (asJson.status === TransactionTracResponseStatus.FAILED) {
          clearInterval(transactionTraceInterval)
          throw new Error(`Cannot retrieve data for transaction with hash: ${this.hash}`)
        } else if (asJson.status === TransactionTracResponseStatus.SUCCESS) {
          transactionTraceJson = getTransactionTraceFromS3(asJson.output)
          clearInterval(transactionTraceInterval)
        } else {
          console.log('TRACE:', transactionTraceJson)
          clearInterval(transactionTraceInterval)
          resolve(transactionTraceJson)
        }
      }, 30_000)
    })
  }
}

export class JSONRpcBytecodeFetcher implements IBytecodeProvider {
  constructor(private provider: ethers.providers.JsonRpcProvider) {}

  async getBytecode(address: string): Promise<string | null> {
    return this.provider.getCode(address)
  }
}

export class JSONRpcTxInfoFetcher implements ITxInfoProvider {
  constructor(public hash: string, private provider: ethers.providers.JsonRpcProvider) {}

  private unifyTxInfo(tx: ethers.providers.TransactionResponse): TTransactionInfo {
    return {
      value: tx.value.toHexString(),
      to: tx.to,
      input: tx.data,
      hash: tx.hash,
      from: tx.from,
      chainId: tx.chainId.toString(),
      blockNumber: tx.blockNumber.toString(),
      blockHash: tx.blockHash,
    }
  }

  async getTxInfo() {
    const tx = await this.provider.getTransaction(this.hash)

    return this.unifyTxInfo(tx)
  }
}
