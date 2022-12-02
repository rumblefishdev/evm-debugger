import { defaultDataProvider } from './helpers/blockchainGetters'
import { TxAnalyzer } from './txAnalyzer'

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const analyzer = new TxAnalyzer(defaultDataProvider, '0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682')

  const result = await analyzer.analyze()

  console.log(result)
})()
