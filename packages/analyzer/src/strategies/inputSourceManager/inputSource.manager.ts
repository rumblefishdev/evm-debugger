import type { TContractFunctionInputParameter, TStorage } from '@evm-debuger/types'

import { CallDataSourceStrategy } from './strategyVariants/callDataSource'
import { MemorySourceStrategy } from './strategyVariants/memorySource'
import { StorageSourceStrategy } from './strategyVariants/storageSource'
import { StackSourceStrategy } from './strategyVariants/stackSource'
import type { TInputSoucrceManager, TInputSourceStrategy } from './inputSource.types'

export class InputSourceManager implements TInputSoucrceManager {
  selectedStrategy: TInputSourceStrategy
  stack: string[]
  memory: string[]
  callData: string
  storage: TStorage

  constructor(stack: string[], memory: string[], callData: string, storage: TStorage, contractFunction: TContractFunctionInputParameter) {
    this.stack = stack
    this.memory = memory
    this.callData = callData
    this.storage = storage

    switch (true) {
      case contractFunction.modifiers.includes('calldata'):
        this.selectedStrategy = new CallDataSourceStrategy(callData, stack, contractFunction)
        break
      case contractFunction.modifiers.includes('memory'):
        this.selectedStrategy = new MemorySourceStrategy(memory, stack, contractFunction)
        break
      case contractFunction.modifiers.includes('storage'):
        this.selectedStrategy = new StorageSourceStrategy(storage, stack, contractFunction)
        break
      default:
        this.selectedStrategy = new StackSourceStrategy(stack, contractFunction)
    }
  }

  readValue() {
    return this.selectedStrategy.readValue()
  }
}
