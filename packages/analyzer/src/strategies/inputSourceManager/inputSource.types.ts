export type TInputSourceStrategy = {
  readValue: () => any
}
export type TInputSoucrceManager = {
  selectedStrategy: TInputSourceStrategy
  stack: string[]
  memory: string[]
  callData: string

  readValue: () => any

  readStrategyName: () => string
}
