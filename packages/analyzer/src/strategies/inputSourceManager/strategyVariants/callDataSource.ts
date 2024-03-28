/* eslint-disable sonarjs/no-small-switch */
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
    const sanitizedCallData = this.callData.replace('0x', '')

    if (this.contractFunction.isArray) {
      const arrayStartPosition = parseInt(this.stack[this.contractFunction.stackInitialIndex], 16)
      const arrayLength = parseInt(this.stack[this.contractFunction.stackInitialIndex - 1], 16)

      const arrayEndPosition = arrayStartPosition + arrayLength * 32

      const result = []

      for (let index = arrayStartPosition; index < arrayEndPosition; index += 32) {
        result.push(`0x${sanitizedCallData.slice(index * 2, (index + 32) * 2).replace(/^0+/, '')}`)
      }

      return result
    }

    const readOffset = parseInt(this.stack[this.contractFunction.stackInitialIndex], 16) * 2
    const readLength = 64

    return `0x${sanitizedCallData.slice(readOffset, readOffset + readLength).replace(/^0+/, '')}`
  }
}
