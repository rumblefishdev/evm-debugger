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
    console.log(`callDataSource: ${this.contractFunction.type}`)

    switch (this.contractFunction.type) {
      case 'bytes32[]': {
        const sanitizedCallData = this.callData.replace('0x', '')

        const arrayStartPosition = parseInt(this.stack[this.contractFunction.stackInitialIndex], 16)
        const arrayLength = parseInt(this.stack[this.contractFunction.stackInitialIndex - 1], 16)

        const arrayEndPosition = arrayStartPosition + arrayLength * 32

        const arrayData = sanitizedCallData.slice(arrayStartPosition * 2, arrayEndPosition * 2)

        const result = []

        for (let index = 0; index < arrayData.length; index += 64) {
          result.push(`0x${arrayData.slice(index, index + 64)}`)
        }

        return result
      }
      default:
        return 'callData'
    }
  }
}
