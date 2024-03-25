import type { TContractFunctionInputParameter, TStorage } from '@evm-debuger/types'

type TInputSourceStrategy = {
  readValue: () => any
}
type TInputSoucrceManager = {
  selectedStrategy: TInputSourceStrategy
  stack: string[]
  memory: string[]
  callData: string
  storage: TStorage

  readValue: () => any
}

class StackSourceStrategy implements TInputSourceStrategy {
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
class MemorySourceStrategy implements TInputSourceStrategy {
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
class CallDataSourceStrategy implements TInputSourceStrategy {
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
class StorageSourceStrategy implements TInputSourceStrategy {
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
