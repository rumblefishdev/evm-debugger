import type { TTransactionInfo } from '@evm-debuger/types'
import { toBeHex, toNumber } from 'ethers'

import type { TEthersTransactionReposnse } from './transactionInfo.types'

export const formatTransactionReposne = (transactionInfo: TEthersTransactionReposnse): TTransactionInfo => {
  const formattedTransactionInfo: TTransactionInfo = {
    ...transactionInfo,
    value: toBeHex(transactionInfo.value),
    input: transactionInfo.data,
    chainId: toNumber(transactionInfo.chainId),
    blockNumber: transactionInfo.blockNumber.toString(),
  }
  return formattedTransactionInfo
}
