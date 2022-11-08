import { txHashes } from './constants/txHash'
import { defaultDataProvider } from './helpers/blockchainGetters'
import { TxAnalyzer } from './txAnalyzer'

async function main() {
    const transactionHash = txHashes.Call__Failed__Call_DelegateCall_StaticCall_Revert[0]

    const analyzer = new TxAnalyzer(defaultDataProvider, '0x750010b08508a740f4599d73eeb77b4c1ce4e010f93241bdee33e4a3eb9bf1d2')

    console.log(await analyzer.analyze())
    await analyzer.analyze()
}

main()
