import type { TTransactionInfo } from '@evm-debuger/types'

import type { TEthersTransactionReposnse } from './transactionInfo.types'

export const formatTransactionReposne = (transactionInfo: TEthersTransactionReposnse): TTransactionInfo => {
  const formattedTransactionInfo: TTransactionInfo = {
    ...transactionInfo,
    value: transactionInfo.value.toHexString(),
    input: transactionInfo.data,
    blockNumber: transactionInfo.blockNumber.toString(),
  }
  return formattedTransactionInfo
}
