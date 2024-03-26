import type { TContractFunctionInputParameter } from '@evm-debuger/types'

import type { TInputSourceStrategy } from '../inputSource.types'

export class StackSourceStrategy implements TInputSourceStrategy {
  private stack: string[]
  private contractFunction: TContractFunctionInputParameter

  constructor(stack: string[], contractFunction: TContractFunctionInputParameter) {
    this.stack = stack
    this.contractFunction = contractFunction
  }

  readValue() {
    return this.stack[this.contractFunction.stackInitialIndex]
  }
}
