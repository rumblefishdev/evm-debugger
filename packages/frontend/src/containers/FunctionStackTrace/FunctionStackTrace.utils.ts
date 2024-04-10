import type { TContractFunction } from '@evm-debuger/types'

import type { TNestedFunction } from './FunctionStackTrace.types'

export const convertFunctionStackToTree = (functionStack: TContractFunction[], rootDepth: number): TNestedFunction => {
  const functionEntry = functionStack[0]
  const innerFunctions: TContractFunction[] = []

  for (const func of functionStack.slice(1)) {
    if (func.isCallType) {
      if (func.depth >= rootDepth + 1) {
        innerFunctions.push(func)
      }

      if (func.depth < rootDepth + 1) {
        break
      }
    } else {
      if (func.depth >= rootDepth + 1 && func.traceLogIndex === functionEntry.traceLogIndex) {
        innerFunctions.push(func)
      }

      if (func.depth < rootDepth + 1) {
        break
      }
    }
  }

  return {
    innerFunctions: innerFunctions
      .map((func) => convertFunctionStackToTree(functionStack.slice(functionStack.indexOf(func)), func.depth))
      .filter((func) => func.function.depth === rootDepth + 1),
    function: functionEntry,
  }
}
