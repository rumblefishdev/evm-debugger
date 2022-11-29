import { defaultDataProvider } from './helpers/blockchainGetters'
import { TxAnalyzer } from './txAnalyzer'

async function main() {
    const analyzer = new TxAnalyzer(defaultDataProvider, '0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682')

    await analyzer.analyze()
}

// try {
//     await main()
// } catch (error) {
//     console.log(error)
// }
