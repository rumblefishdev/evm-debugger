import { network } from 'hardhat'
import type { TTransactionData } from '@evm-debuger/types'
import { writeFileSync } from 'fs'

import { TxAnalyzer } from './src/txAnalyzer'

const TRANSACTION_HASH = '0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const traceResult = await network.provider.send('debug_traceTransaction', [TRANSACTION_HASH, { tracer: 'callTracer' }])

  writeFileSync('trace.json', JSON.stringify(traceResult, null, 2))

  const transactionInfo = await network.provider.send('eth_getTransactionByHash', [TRANSACTION_HASH])

  const transactionData: TTransactionData = {
    transactionInfo,
    structLogs: traceResult.structLogs,
  }

  const analyzer = new TxAnalyzer(transactionData)

  const result = await analyzer.analyze()

  // console.log(result)
})()