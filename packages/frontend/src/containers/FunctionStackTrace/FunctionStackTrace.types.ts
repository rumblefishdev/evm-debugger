import type { TContractFunction } from '@evm-debuger/types'

export type TNestedFunction = {
  function: TContractFunction
  innerFunctions: TNestedFunction[]
}

export type TFunctionStackTraceComponentProps = {
  activeTraceLogIndex: number
  activeStructLogIndex: number
  activateFunction: (traceLogIndex: number, structLogIndex: number) => void
  toggleMainFunctions: () => void
  toggleYulFunctions: () => void
  isNonMainFunctionsVisible: boolean
  isYulFunctionsVisible: boolean
  functionStack: TNestedFunction
}
