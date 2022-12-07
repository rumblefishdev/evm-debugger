import { defaultDataProvider } from './helpers/blockchainGetters'
import { TxAnalyzer } from './txAnalyzer'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const analyzer = new TxAnalyzer(defaultDataProvider, '0x647c6e60ad32cab0ce2451a7054e5602cde4d4d58a513ddba5cf8d74a3236029')

  const result = await analyzer.analyze()

  // console.log(result.map(item))
})()
