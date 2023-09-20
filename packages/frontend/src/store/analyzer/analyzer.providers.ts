import type ethers from 'ethers'
import type { IStructLog, TTransactionInfo, TSrcMapAddres, ChainId, ISrcMapApiPayload, ISrcMapApiResponseBody } from '@evm-debuger/types'
import { TransactionTraceResponseStatus, SrcMapStatus } from '@evm-debuger/types'

import { store } from '../store'

import { analyzerActions } from './analyzer.slice'
import type { IBytecodeProvider, IStructLogProvider, ITxInfoProvider, IContractSourceProvider, TContractsSources } from './analyzer.types'

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

// TODO Leaving for now as a reference - REMOVE LATER
// export class EtherscanSourceFetcher implements ISourceProvider {
//   constructor(private etherscanUrl: string, private etherscanKey: string) {}

//   async getSource(address: string) {
//     const response = await fetch(
//       `${this.etherscanUrl}/api?module=contract&action=getsourcecode&address=${address}&apikey=${this.etherscanKey}`,
//     )
//     if (response.status !== 200) throw new Error(`Etherscan returned ${response.status} response code`)

//     const asJson = await response.json()
//     if (!asJson.result[0].SourceCode) throw new Error(`${address} is not verified on Etherscan`)

//     return {
//       sourceCode: asJson.result[0].SourceCode,
//       contractName: asJson.result[0].ContractName,
//       abi: JSON.parse(asJson.result[0].ABI),
//     }
//   }
// }

export class ContractSourceFetcher implements IContractSourceProvider {
  constructor(private srcMapProviderUrl: string, private chainId: ChainId) {}

  async getSources(addresses: Set<string>): Promise<TContractsSources> {
    return new Promise((resolve, reject) => {
      const srcMapInterval = setInterval(async () => {
        const resp = await fetch(`${this.srcMapProviderUrl}/srcmap-api`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addresses: Array.from(addresses).map(
              (address) =>
                ({
                  chainId: this.chainId,
                  address,
                } as TSrcMapAddres),
            ),
          }),
        })

        if (resp.status !== 200) {
          clearInterval(srcMapInterval)
          reject(`Cannot retrieve data for addresses: ${addresses}`)
        }
        const asJson: ISrcMapApiResponseBody = await resp.json()

        if (!asJson.data) {
          clearInterval(srcMapInterval)
          reject(`Empty data for addresses: ${addresses}`)
        }

        const payloads: Record<string, ISrcMapApiPayload> = asJson.data
        const sources: TContractsSources = Object.entries(payloads).reduce((accumulator: TContractsSources, [address, current]) => {
          accumulator[address] = {
            srcMap: current.sourceMaps,
            sourceCode: current.sourceData.SourceCode,
            contractName: current.sourceData.ContractName,
            abi: current.sourceData.ABI,
          }
          return accumulator
        }, {})

        store.dispatch(analyzerActions.logMessage(`Fetching srcMap status: ${asJson.status}`))
        if (asJson.status === SrcMapStatus.FAILED) {
          clearInterval(srcMapInterval)
          reject(`Cannot retrieve data for transaction with hash:Reason: ${asJson.error}`)
        } else if (asJson.status === SrcMapStatus.SUCCESS) {
          clearInterval(srcMapInterval)
          resolve(sources)
        }
      }, 15_000)
    })
  }
}

export class TransactionTraceFetcher implements IStructLogProvider {
  constructor(private transactionTraceProviderUrl: string, public hash: string, private chainId: number) {}

  // eslint-disable-next-line id-denylist
  async getStructLog(): Promise<IStructLog[]> {
    return new Promise((resolve, reject) => {
      const transactionTraceInterval = setInterval(async () => {
        const response = await fetch(`${this.transactionTraceProviderUrl}/analyzerData/${this.hash}/${this.chainId}`)
        const asJson = await response.json()
        console.log('INVOKE:', asJson)

        store.dispatch(analyzerActions.logMessage(`Fetching structLogs status: ${asJson.status}`))

        if (asJson.status === TransactionTraceResponseStatus.FAILED) {
          clearInterval(transactionTraceInterval)
          reject(`Cannot retrieve data for transaction with hash: ${this.hash}. Reason: ${asJson.errorDetails}`)
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
      chainId: tx.chainId,
      blockNumber: tx.blockNumber.toString(),
      blockHash: tx.blockHash,
    }
  }

  async getTxInfo() {
    const tx = await this.provider.getTransaction(this.hash)

    return this.unifyTxInfo(tx)
  }
}
