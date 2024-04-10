import type { TContractFunctionInputParameter, TStorage } from '@evm-debuger/types'

import { CallDataSourceStrategy } from './strategyVariants/callDataSource'
import { MemorySourceStrategy } from './strategyVariants/memorySource'
import { StackSourceStrategy } from './strategyVariants/stackSource'
import type { TInputSoucrceManager, TInputSourceStrategy } from './inputSource.types'

export class InputSourceManager implements TInputSoucrceManager {
  selectedStrategy: TInputSourceStrategy
  stack: string[]
  memory: string[]
  callData: string

  constructor(stack: string[], memory: string[], callData: string, contractFunction: TContractFunctionInputParameter) {
    this.stack = [...stack].reverse()
    this.memory = memory
    this.callData = callData
    switch (true) {
      case contractFunction.modifiers.includes('calldata'):
        this.selectedStrategy = new CallDataSourceStrategy(this.callData, this.stack, contractFunction)
        break
      case contractFunction.modifiers.includes('memory'):
        this.selectedStrategy = new MemorySourceStrategy(this.memory, this.stack, contractFunction)
        break
      default:
        this.selectedStrategy = new StackSourceStrategy(this.stack, contractFunction)
    }
  }

  readStrategyName() {
    return this.selectedStrategy.constructor.name
  }

  readValue() {
    return this.selectedStrategy.readValue()
  }

  returnSourceData() {
    return {
      stack: this.stack,
      memory: this.memory,
      callData: this.callData,
    }
  }
}
