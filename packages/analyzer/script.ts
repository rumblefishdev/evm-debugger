import { network } from 'hardhat'
import type { TTransactionData } from '@evm-debuger/types'
import fetch from 'node-fetch'
import { TxAnalyzer } from './src'

const TRANSACTION_HASH = '0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const traceResult = await network.provider.send('debug_traceTransaction', [TRANSACTION_HASH, { tracer: 'callTracer' }])

  const transactionInfo = await network.provider.send('eth_getTransactionByHash', [TRANSACTION_HASH])

  const transactionData: TTransactionData = {
    transactionInfo,
    structLogs: traceResult.structLogs,
    abis: {},
  }

  const analyzer = new TxAnalyzer(transactionData)

  const addresses = analyzer.getContractAddressesInTransaction()

  for (const address of addresses) {
    const response = await fetch(
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=Y8XNE3W519FITZJRPRGYY4ZEII2IV3W73F`
    )

    const { result, status } = await response.json()

    if (status === '1') {
      transactionData.abis[address] = result
    }
  }

  const result = analyzer.analyze()

  console.log(result.completenessChecker.contractSighashesList)
})()
