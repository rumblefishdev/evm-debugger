import type { TNestedFunction } from '../FunctionStackTrace.types'

export type TFunctionEntryContainerProps = {
  functionElement: TNestedFunction
  activateFunction: (traceLogIndex: number, structLogIndex: number) => void
}

export type TFunctionEntryComponentProps = {
  functionElement: TNestedFunction
  canBeExpanded: boolean
  activateFunction: (traceLogIndex: number, structLogIndex: number) => void
}

export type TOpcodeVariants = 'Call' | 'Create' | 'Jumpdest' | 'Missing'

export type TEntryType = 'Main' | 'Yul' | 'NonMain'
