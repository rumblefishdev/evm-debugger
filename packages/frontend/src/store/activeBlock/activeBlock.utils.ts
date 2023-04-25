import { ethers } from 'ethers'

import { isArrayOfStrings } from '../../helpers/helpers'

export const safeArgParse = (
  arg:
    | string
    | ethers.BigNumber
    | boolean
    | string[]
    | ethers.utils.BytesLike
    | ethers.BigNumber[]
    | number,
) => {
  if (typeof arg === 'string') return arg

  if (ethers.BigNumber.isBigNumber(arg))
    return `${ethers.utils.formatEther(
      ethers.BigNumber.from(arg).toString(),
    )} ETH`

  if (typeof arg === 'boolean') return arg ? 'true' : 'false'

  if (ethers.utils.isBytesLike(arg)) return arg.toString()

  if (typeof arg === 'number') return arg

  if (isArrayOfStrings(arg)) return arg

  if (
    Array.isArray(arg) &&
    arg.every((item) => ethers.BigNumber.isBigNumber(item))
  )
    return arg.map(
      (item) =>
        `${ethers.utils.formatEther(
          ethers.BigNumber.from(item).toString(),
        )} ETH`,
    )
}

export const parseParameter = (parameterType, parameterValue) => {
  let parsedValues

  if (typeof parameterValue === 'string')
    parsedValues = safeArgParse(parameterValue)
  else if (parameterType.type === 'tuple[]')
    parsedValues = parameterValue.map((value) =>
      parseParameter(parameterType.arrayChildren, value),
    )
  else if (parameterType.baseType === 'array')
    parsedValues = parameterValue.map((value) => safeArgParse(value))
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

export const parseParameters = (
  params: ethers.utils.ParamType[],
  result: ethers.utils.Result,
) => {
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
