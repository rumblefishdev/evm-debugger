import type { TTransactionInfo } from '@evm-debuger/types'
import { toBeHex, toNumber } from 'ethers'

import type { TEthersTransactionReposnse } from './transactionInfo.types'

export const formatTransactionReposne = (transactionInfo: TEthersTransactionReposnse): TTransactionInfo => {
  const formattedTransactionInfo: TTransactionInfo = {
    value: toBeHex(transactionInfo.value),
    to: transactionInfo.to,
    nonce: transactionInfo.nonce,
    input: transactionInfo.data,
    hash: transactionInfo.hash,
    gasLimit: transactionInfo.gasLimit,
    from: transactionInfo.from,
    chainId: toNumber(transactionInfo.chainId),
    blockNumber: transactionInfo.blockNumber.toString(),
    blockHash: transactionInfo.blockHash,
  }
  if (transactionInfo.gasLimit > BigInt(2000000)) {
    throw Error(`Currently, we do not support transactions over 2 million gas. Your transaction has ${transactionInfo.gasLimit} gas`)
  }
  return formattedTransactionInfo
}
