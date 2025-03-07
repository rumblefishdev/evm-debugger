import { network } from 'hardhat'
import { prepareAnalyzer } from './scriptHelper'

const TRANSACTION_HASH = '0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const traceResult = await network.provider.send('debug_traceTransaction', [TRANSACTION_HASH, { tracer: 'callTracer' }])
  const transactionInfo = await network.provider.send('eth_getTransactionByHash', [TRANSACTION_HASH])

  const analyzer = await prepareAnalyzer(transactionInfo,traceResult.structLogs)

  const result = analyzer.analyze()

  console.log(result)
})()
