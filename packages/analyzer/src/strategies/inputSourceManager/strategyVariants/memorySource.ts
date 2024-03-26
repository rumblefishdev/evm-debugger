import type { TContractFunctionInputParameter } from '@evm-debuger/types'

import type { TInputSourceStrategy } from '../inputSource.types'

export class MemorySourceStrategy implements TInputSourceStrategy {
  private memory: string[]
  private stack: string[]
  private contractFunction: TContractFunctionInputParameter
  constructor(memory: string[], stack: string[], contractFunction: TContractFunctionInputParameter) {
    this.memory = memory
    this.stack = stack
    this.contractFunction = contractFunction
  }

  readValue() {
    return 'memory'
  }
}
