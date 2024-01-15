/* eslint-disable import/exports-last */
import { writeFile } from 'node:fs/promises'

import { network } from '@rumblefishdev/hardhat'

export const TRANSACTION_HASH = '0x700f45b99578bef81d5a6bb34117145dcedb5df4a0dadb5267c0b603489c4e3e'
export const fetchTransactionByHash = async () => {
  const transactionInfo = await network.provider.send('eth_getTransactionByHash', [TRANSACTION_HASH])

  await writeFile(`${TRANSACTION_HASH}.json`, JSON.stringify(transactionInfo, null, 2))
}

fetchTransactionByHash()
  .then(() => console.log('Done'))
  .catch(console.error)
