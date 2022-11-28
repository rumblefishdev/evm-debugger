import { txHashes } from './constants/txHash'
import { defaultDataProvider } from './helpers/blockchainGetters'
import { TxAnalyzer } from './txAnalyzer'

async function main() {
    const transactionHash = txHashes.Call__Success__Call_StaticCall_Return_Stop[0]

    const analyzer = new TxAnalyzer(defaultDataProvider, transactionHash)

    await analyzer.analyze()
}

main()
