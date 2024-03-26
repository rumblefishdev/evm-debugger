import type { TContractFunctionInputParameter, TStorage } from '@evm-debuger/types'

import type { TInputSourceStrategy } from '../inputSource.types'

export class StorageSourceStrategy implements TInputSourceStrategy {
  private storage: TStorage
  private stack: string[]
  private contractFunction: TContractFunctionInputParameter
  constructor(storage: TStorage, stack: string[], contractFunction: TContractFunctionInputParameter) {
    this.storage = storage
    this.stack = stack
    this.contractFunction = contractFunction
  }

  readValue() {
    return 'storage'
  }
}
