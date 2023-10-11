import { ChainIds } from '@evm-debuger/config'

import { mapEnumToObject } from '../src/utils'
import { selectPrompt } from '../src/prompts'
import { startHadrhatNode } from '../src/hardhatNode'

/* eslint-disable prettier/prettier */
(async () => {
  try {
    const { promptValue: chainId } = await selectPrompt<ChainIds>('Choose a chain for node to fork', mapEnumToObject(ChainIds))

    startHadrhatNode(chainId)

  }catch (error) {
    console.log(error)
  }
})()
