import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'

import type {
  IStructLogProvider,
  ITxInfoProvider,
  IAbiProvider,
} from './analyzer.types'

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
    const response = await fetch(
      `${this.etherscanUrl}/api?module=contract&action=getabi&address=${address}&apikey=${this.etherscanKey}`,
    )
    if (response.status !== 200)
      throw new Error(`Etherscan returned ${response.status} response code`)

    const asJson = await response.json()
    if (asJson.status !== '1')
      throw new Error(`${address} is not verified on Etherscan`)

    return JSON.parse(asJson.result)
  }
}
