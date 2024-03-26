import type { TContractFunctionInputParameter } from '@evm-debuger/types'

import type { TInputSourceStrategy } from '../inputSource.types'

export class CallDataSourceStrategy implements TInputSourceStrategy {
  private callData: string
  private stack: string[]
  private contractFunction: TContractFunctionInputParameter
  constructor(callData: string, stack: string[], contractFunction: TContractFunctionInputParameter) {
    this.callData = callData
    this.stack = stack
    this.contractFunction = contractFunction
  }

  readValue() {
    return 'callData'
  }
}
