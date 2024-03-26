import type { TStorage } from '@evm-debuger/types'

export type TInputSourceStrategy = {
  readValue: () => any
}
export type TInputSoucrceManager = {
  selectedStrategy: TInputSourceStrategy
  stack: string[]
  memory: string[]
  callData: string
  storage: TStorage

  readValue: () => any
}
