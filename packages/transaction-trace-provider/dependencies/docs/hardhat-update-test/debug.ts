import hardhat from '@rumblefishdev/hardhat'
import { reset } from '@nomicfoundation/hardhat-network-helpers'
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import 'dotenv/config'
import {forkingUrlMap} from "./hardhat.config";
const { structLogsEmitter } = require('hardhat/internal/hardhat-network/stack-traces/vm-debug-tracer.js');

if (!process.env.ALCHEMY_KEY) throw Error("No ALCHEMY_KEY in .env")

// Script for debugging hardhat's debug_traceTransaction
// Run it via `npm run debug`

// Very big transaction, always failing without patch on USA based machines
// const txHash = '0xcfc0e43ce1ddb6ef2938819b5e90ec07aadf5bf2bfdb217ab81685f5acf5fb88'

//// PUSH0 transaction
const txHash = '0x08d97335ac1913d382170eeffe5ace356daeab310bd7b83447bef34d5928a115'

const chainId = '1'
const hardhatForkingUrl = forkingUrlMap[Number(chainId) as keyof typeof forkingUrlMap]

reset(`${hardhatForkingUrl}${process.env.ALCHEMY_KEY}`)
  .then(() => {
    hardhat.run(TASK_NODE_GET_PROVIDER, { chainId })
      .then((hardhatProvider) => {
        console.log('Hardhat provider', hardhatProvider)
        console.log(`Starting debug_traceTransaction for ${txHash}`)

        structLogsEmitter.on("structLog", handler)

        hardhatProvider.send('debug_traceTransaction', [txHash])
          .then((traceResult: any) => {
            structLogsEmitter.removeListener('structLog', handler)
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

const handler = (structLog: any) => {
  console.log(structLog)
}
