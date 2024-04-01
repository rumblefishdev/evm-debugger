import type { TContractFunction } from '@evm-debuger/types'

import type { TNestedFunction } from './FunctionStackTrace.types'

export const convertFunctionStackToTree = (functionStack: TContractFunction[], rootDepth: number): TNestedFunction => {
  const _rootFunction = functionStack[0]
  const innerFunctions = functionStack.slice(1).filter((func) => func.depth === rootDepth + 1)

  return {
    innerFunctions: innerFunctions.map((rootFunction) => {
      const rootFunctionIndex = functionStack.indexOf(rootFunction)
      const functionStackFromRoot = functionStack.slice(rootFunctionIndex)
      const functionStackFromRootCopy = [...functionStackFromRoot].slice(1)
      const functionStackEndIndex = functionStackFromRootCopy.reverse().findIndex((func) => func.depth === rootFunction.depth)

      console.log('rootFunction', rootFunction)
      console.log('rootFunctionIndex', rootFunctionIndex)
      console.log('functionStackFromRoot', functionStackFromRoot)
      console.log('functionStackEndIndex', functionStackEndIndex)
      console.log('functionStackFromRoot.slice(0, functionStackEndIndex)', functionStackFromRoot.slice(0, functionStackEndIndex))
      console.log('===================================================')
      if (rootFunction.isYul || !rootFunction.isMain) {
        return {
          innerFunctions: [],
          function: rootFunction,
        }
      }

      return convertFunctionStackToTree(functionStackFromRoot.slice(0, functionStackEndIndex), rootFunction.depth)
    }),
    function: _rootFunction,
  }
}
