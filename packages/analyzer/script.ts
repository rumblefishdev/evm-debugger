import { writeFileSync } from 'node:fs'

import { network } from 'hardhat'
import type { TTransactionData } from '@evm-debuger/types'

import { TxAnalyzer } from './src/txAnalyzer'

const TRANSACTION_HASH = '0x8733fe2859afb044abe28859e71486d24758706320fdf47eb280c5fbc9bee51f'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const traceResult = await network.provider.send('debug_traceTransaction', [TRANSACTION_HASH, { tracer: 'callTracer' }])

  writeFileSync('traceResult.json', JSON.stringify(traceResult, null, 2))

  const transactionInfo = await network.provider.send('eth_getTransactionByHash', [TRANSACTION_HASH])

  writeFileSync('transactionInfo.json', JSON.stringify(transactionInfo, null, 2))

  const transactionData: TTransactionData = {
    transactionInfo,
    structLogs: traceResult.structLogs,
  }

  const analyzer = new TxAnalyzer(transactionData)

  const result = await analyzer.analyze()

  console.log(result)
})()
