import type ethers from 'ethers'
import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { store } from '../store'

import { analyzerActions } from './analyzer.slice'
import type { ISourceProvider, IBytecodeProvider, IStructLogProvider, ITxInfoProvider } from './analyzer.types'

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

export class EtherscanSourceFetcher implements ISourceProvider {
  constructor(private etherscanUrl: string, private etherscanKey: string) {}

  async getSource(address: string) {
    const response = await fetch(
      `${this.etherscanUrl}/api?module=contract&action=getsourcecode&address=${address}&apikey=${this.etherscanKey}`,
    )
    if (response.status !== 200) throw new Error(`Etherscan returned ${response.status} response code`)

    const asJson = await response.json()
    if (!asJson.result[0].SourceCode) throw new Error(`${address} is not verified on Etherscan`)

    return {
      sourceCode: asJson.result[0].SourceCode,
      contractName: asJson.result[0].ContractName,
      abi: JSON.parse(asJson.result[0].ABI),
    }
  }
}

export class TransactionTraceFetcher implements IStructLogProvider {
  constructor(private transactionTraceProviderUrl: string, public hash: string, private chainId: number) {}

  // eslint-disable-next-line id-denylist
  async getStructLog(): Promise<IStructLog[]> {
    return new Promise((resolve) => {
      const transactionTraceInterval = setInterval(async () => {
        const response = await fetch(`${this.transactionTraceProviderUrl}/analyzerData/${this.hash}/${this.chainId}`)
        console.log(response)
        const asJson = await response.json()
        console.log('INVOKE:', asJson)

        store.dispatch(analyzerActions.logMessage(`Fetching structLogs status: ${asJson.status}`))

        if (asJson.status === TransactionTraceResponseStatus.FAILED) {
          clearInterval(transactionTraceInterval)
          throw new Error(`Cannot retrieve data for transaction with hash: ${this.hash}`)
        } else if (asJson.status === TransactionTraceResponseStatus.SUCCESS) {
          const transactionTrace = await fetch(`https://${asJson.s3Location}`)

          clearInterval(transactionTraceInterval)
          const parsed = await transactionTrace.json()
          resolve(parsed.structLogs)
        }
      }, 15_000)
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
      nonce: tx.nonce,
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
