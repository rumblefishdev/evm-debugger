import type { TContractFunction } from '@evm-debuger/types'

import type { TNestedFunction } from './FunctionStackTrace.types'

export const convertFunctionStackToTree = (functionStack: TContractFunction[], rootDepth: number): TNestedFunction => {
  const _rootFunction = functionStack[0]
  const innerFunctions = functionStack.slice(1).filter((func) => func.depth === rootDepth + 1)

  return {
    innerFunctions: innerFunctions.map((rootFunction) => {
      const rootFunctionIndex = functionStack.indexOf(rootFunction)
      const functionStackFromRoot = functionStack
        .slice(rootFunctionIndex)
        .filter((func) => func.traceLogIndex === rootFunction.traceLogIndex)
      const functionStackFromRootCopy = [...functionStackFromRoot].slice(1)

      const functionStackEndIndex = functionStackFromRootCopy.reverse().findIndex((func) => func.depth === rootFunction.depth)

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
// TODO: For future use
export const increaseFunctionDepth = (functionStack: TNestedFunction, depth: number): TNestedFunction => {
  return {
    ...functionStack,
    innerFunctions: functionStack.innerFunctions.map((innerFunction) => {
      return increaseFunctionDepth(innerFunction, depth)
    }),
    function: { ...functionStack.function, depth: functionStack.function.depth + depth },
  }
}
// TODO: For future use
export const placeholderFunction = (nestedFunction: TNestedFunction, functionToPush: TNestedFunction): TNestedFunction => {
  if (nestedFunction.innerFunctions.some((innerFunction) => innerFunction.function.index > functionToPush.function.index)) {
    nestedFunction.innerFunctions.push(increaseFunctionDepth(functionToPush, nestedFunction.function.depth))
    nestedFunction.innerFunctions.sort((a, b) => a.function.index - b.function.index)
    return nestedFunction
  }

  return {
    ...nestedFunction,
    innerFunctions: nestedFunction.innerFunctions.map((innerFunction) => {
      return placeholderFunction(innerFunction, functionToPush)
    }),
  }
}
// TODO: For future use
export const adjustFunctionStackTree = (functionStack: TNestedFunction): TNestedFunction => {
  if (functionStack.innerFunctions.length === 0) {
    return functionStack
  }

  const innerFunctions = functionStack.innerFunctions.reduce<TNestedFunction[]>((accumulator, innerFunction) => {
    if (accumulator.length === 0) {
      accumulator.push(innerFunction)
      return [...accumulator]
    }

    if (accumulator.at(-1).function.isMain && accumulator.at(-1).innerFunctions.length > 0) {
      accumulator[accumulator.length - 1] = placeholderFunction(accumulator.at(-1), innerFunction)
      return [...accumulator]
    }

    accumulator.push(innerFunction)

    return [...accumulator]
  }, [])

  return {
    innerFunctions,
    function: functionStack.function,
  }
}
