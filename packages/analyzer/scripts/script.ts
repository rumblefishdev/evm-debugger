const hardhat = require("hardhat")
import type { TTransactionData } from '@evm-debuger/types'
import { prepareAnalyzer } from './scriptHelper'

const TRANSACTION_HASH = '0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  let newHard = await hardhat.run("node:get-provider");

  const traceResult = await newHard.send('debug_traceTransaction', [TRANSACTION_HASH, { tracer: 'callTracer' }])
  const transactionInfo = await newHard.send('eth_getTransactionByHash', [TRANSACTION_HASH])

  const transactionData: TTransactionData = {
    transactionInfo,
    structLogs: traceResult.structLogs,
    abis: {},
  }

  const analyzer = await prepareAnalyzer(transactionData)
  const result = analyzer.analyze()

  console.log(result)
})()
