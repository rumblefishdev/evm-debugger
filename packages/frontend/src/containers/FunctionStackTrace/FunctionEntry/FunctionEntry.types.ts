import type { TNestedFunction } from '../FunctionStackTrace.types'

export type TFunctionEntryContainerProps = {
  functionElement: TNestedFunction
}

export type TFunctionEntryComponentProps = {
  functionElement: TNestedFunction
  canBeExpanded: boolean
}
