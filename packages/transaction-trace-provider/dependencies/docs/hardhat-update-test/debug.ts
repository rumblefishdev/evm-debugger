import hardhat from 'hardhat'
import { reset } from '@nomicfoundation/hardhat-network-helpers'
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import 'dotenv/config'

if (!process.env.ALCHEMY_KEY) throw Error("No ALCHEMY_KEY in .env")

// Script for debugging hardhat's debug_traceTransaction
// Run it via `npm run debug`

//// Very big transaction, always failing without patch on USA based machines
const txHash = '0x9aecfb4d762a13188d876c64baec7646c9b58f10605d4ef63bfb80d0eb5ec5a7'

//// PUSH0 transaction
// const txHash = '0x08d97335ac1913d382170eeffe5ace356daeab310bd7b83447bef34d5928a115'

const chainId = '1'
const hardhatForkingUrl = 'https://eth-mainnet.alchemyapi.io/v2/'

reset(`${hardhatForkingUrl}${process.env.ALCHEMY_KEY}`)
  .then(() => {
    hardhat.run(TASK_NODE_GET_PROVIDER, { chainId })
      .then((hardhatProvider) => {
        console.log('Hardhat provider', hardhatProvider)
        console.log(`Starting debug_traceTransaction for ${txHash}`)

        hardhatProvider.send('debug_traceTransaction', [txHash])
          .then((traceResult: any) => {
            console.log(traceResult)
          })
          .catch((error: any) => {
            console.log('debug_traceTransaction error', error)
          })
      })
      .catch((error: any) => {
        console.log('TASK_NODE_GET_PROVIDER error', error)
      })
  })
  .catch((error: any) => {
    console.log('reset error', error)
  })
