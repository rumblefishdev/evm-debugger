// TODO: remove ts-ignore and fix typescript errors
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { BytesLike, Result, ParamType } from 'ethers'
import { formatEther, isBytesLike } from 'ethers'

import { isArrayOfStrings } from '../../helpers/helpers'

export const safeArgParse = (arg: string | bigint | boolean | string[] | BytesLike | bigint[] | number) => {
  if (typeof arg === 'string') return arg

  if (BigInt(arg)) return `${formatEther(BigInt(arg).toString())} ETH`

  if (typeof arg === 'boolean') return arg ? 'true' : 'false'

  if (isBytesLike(arg)) return arg.toString()

  if (typeof arg === 'number') return arg

  if (isArrayOfStrings(arg)) return arg

  if (Array.isArray(arg) && arg.every((item) => BigInt(item))) return arg.map((item) => `${formatEther(BigInt(item).toString())} ETH`)
}

export const parseParameter = (parameterType, parameterValue) => {
  let parsedValues

  if (typeof parameterValue === 'string') parsedValues = safeArgParse(parameterValue)
  else if (parameterType.type === 'tuple[]')
    parsedValues = parameterValue.map((value) => parseParameter(parameterType.arrayChildren, value))
  else if (parameterType.baseType === 'array') parsedValues = parameterValue.map((value) => safeArgParse(value))
  else if (parameterType.baseType === 'tuple')
    parsedValues = parameterType.components.map((component, index) => {
      return parseParameter(component, parameterValue[index])
    })
  else parsedValues = safeArgParse(parameterValue)

  return {
    value: parsedValues,
    type: parameterType.type,
    name: parameterType.name,
  }
}

export const parseParameters = (params: ParamType[], result: Result) => {
  return params.map((parameterType, index) => {
    if (result) {
      const parameterValue = result[index]
      return parseParameter(parameterType, parameterValue)
    }

    return {
      value: 'Failed to decode',
      type: parameterType.type,
      name: parameterType.name,
    }
  })
}
