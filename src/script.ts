import { defaultDataProvider } from './helpers/blockchainGetters'
import { TxAnalyzer } from './txAnalyzer'

async function main() {
    // const transactionHash = '0x8136bfb671e98ab1cc279df575abe3ea551f8fa7c7c787f4f6a7ed614b4b7247' // Root = Call | Failed | [Call,DelegateCall,StaticCall,Revert,Revert]
    // const transactionHash = '0x5bd69cab4bbd5864a18ec23bd685d94c9ab58e94662409ea10fea756019e3c4f' // Root = Call | Failed | [Call,Create,Revert]
    // const transactionHash = '0xfe12892c9676881b66807797002e2c9473ef5ee62dddeb8adc30eb62f18612b7' // Root = Create | Success | [Create,Return]
    // const transactionHash = '0x8733fe2859afb044abe28859e71486d24758706320fdf47eb280c5fbc9bee51f' // Root = Call | Success | [Call,Create,Return]
    const transactionHash = '0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682' // Root = Call |  Success | [Call,StaticCall,Return,Stop]
    // const transactionHash = '0x75eb09c0c35347a44a006a8702a45b13539a5c666337d7b1ddb2ffcc85d14e90' // Root = Call |  Success | [Call,StaticCall,Return,Stop]

    const analyzer = new TxAnalyzer(defaultDataProvider, transactionHash)

    console.log(await analyzer.analyze())
    // await analyzer.analyze()
}

main()
