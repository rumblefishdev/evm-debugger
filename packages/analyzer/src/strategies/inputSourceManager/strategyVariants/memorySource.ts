import type { TContractFunctionInputParameter } from '@evm-debuger/types'

import type { TInputSourceStrategy } from '../inputSource.types'
import { readMemory } from '../../../helpers/helpers'

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
    console.log(`memorySource: ${this.contractFunction.type}`)

    switch (this.contractFunction.type) {
      case 'bytes32[]': {
        const readLength = this.stack[this.contractFunction.stackInitialIndex]
        const readStart = this.stack[this.contractFunction.stackInitialIndex - 1]

        const memoryReadValue = readMemory(this.memory, readStart, readLength)
        const memoryWordArray = memoryReadValue.match(/.{1,64}/g)
        const bytesArrayLength = parseInt(memoryWordArray[0], 16)

        const result = memoryWordArray.slice(1, bytesArrayLength + 1)

        return result.map((r) => `0x${r}`)
      }
      default:
        return 'memory'
    }
  }
}
