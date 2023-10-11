import { ALCHEMY_API_URLS, API_KEYS, BLOCK_NUMBERS, ChainIds } from '@evm-debuger/config'
import hardhat from 'hardhat'
import { TASK_NODE } from 'hardhat/builtin-tasks/task-names'

import type { TTempExecs } from './types'
import { Paths } from './paths'
import { saveToFile } from './utils'

export const startHadrhatNode = (chainId: ChainIds) => {
  const forkingUrl = `${ALCHEMY_API_URLS[chainId]}${API_KEYS.alchemy}`
  const blockNumber = BLOCK_NUMBERS[chainId]

  hardhat.config.networks.hardhat.forking = {
    url: forkingUrl,
    enabled: true,
    blockNumber,
  }
  hardhat.config.networks.hardhat.chainId = chainId

  // TIMEOUT 10 minuts
  hardhat.config.networks.localhost.timeout = 600000

  const ChainText = ChainIds[chainId]
  const BlockNumberText = blockNumber
  const ForkingUrlText = `${ALCHEMY_API_URLS[chainId]}`

  console.log(`Forking ${ChainText} at block ${BlockNumberText} from ${ForkingUrlText}`)

  const tempPayload: TTempExecs = {
    forkingUrl,
    forkBlockNumber: blockNumber,
    chainId,
  }

  saveToFile(Paths.TEMP_EXECS, tempPayload)

  hardhat.run(TASK_NODE)
}
