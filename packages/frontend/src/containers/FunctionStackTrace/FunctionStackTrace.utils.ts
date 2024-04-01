import type { TContractFunction } from '@evm-debuger/types'

import type { TNestedFunction } from './FunctionStackTrace.types'

export const convertFunctionStackToTree = (functionStack: TContractFunction[], rootDepth: number): TNestedFunction => {
  const _rootFunction = functionStack[0]
  const innerFunctions = functionStack.slice(1).filter((func) => func.depth === rootDepth + 1)

  return {
    innerFunctions: innerFunctions.map((rootFunction) => {
      const rootFunctionIndex = functionStack.indexOf(rootFunction)
      const functionStackFromRoot = functionStack.slice(rootFunctionIndex)
      // .filter((func) => func.traceLogIndex === rootFunction.traceLogIndex)
      const functionStackFromRootCopy = [...functionStackFromRoot].slice(1)

      const functionStackEndIndex = functionStackFromRootCopy.reverse().findIndex((func) => func.depth === rootFunction.depth)

      console.log('rootFunction', rootFunction)
      console.log('rootFunctionIndex', rootFunctionIndex)
      console.log('functionStackFromRoot', functionStackFromRoot)
      console.log('functionStackFromRootCopy', functionStackFromRootCopy)
      console.log('functionStackEndIndex', functionStackEndIndex)
      console.log('===================================================')

      if (rootFunction.isYul || !rootFunction.isMain) {
        return {
          innerFunctions: [],
          function: rootFunction,
        }
      }

      if (functionStackEndIndex === -1) {
        return convertFunctionStackToTree(functionStackFromRoot, rootFunction.depth)
      }

      return convertFunctionStackToTree(
        functionStackFromRoot.slice(0, functionStackFromRoot.length - functionStackEndIndex),
        rootFunction.depth,
      )
    }),
    function: _rootFunction,
  }
}
