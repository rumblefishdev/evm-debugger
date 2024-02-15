import type { TTransactionInfo } from '@evm-debuger/types'

export class TransactionInfoState implements TTransactionInfo {
  blockHash: string
  blockNumber: string
  chainId: number
  from: string
  hash: string
  input: string
  nonce: number
  to: string
  value: string
  gasLimit?: string
  constructor() {
    this.blockHash = ''
    this.blockNumber = ''
    this.chainId = 0
    this.from = ''
    this.hash = ''
    this.input = ''
    this.nonce = 0
    this.to = ''
    this.value = ''
    this.gasLimit = ''
  }
}
