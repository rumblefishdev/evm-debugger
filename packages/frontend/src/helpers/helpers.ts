import type { TOpcodesNames } from '@evm-debuger/types'
import type { FunctionFragment } from 'ethers'
import type { Theme } from '@mui/material'

import type { TExtendedStack } from '../types'

export const itemSpacePercentageByGasCost = (gasCost: number, parentGasCost: number) => {
  const MAX_SPACE = 100
  const ROUNDING = 0

  // eslint-disable-next-line no-magic-numbers
  return Number.parseInt(((gasCost / parentGasCost) * MAX_SPACE).toFixed(ROUNDING))
}
export const isDarkOrNavy = (theme: Theme) => {
  return ['dark', 'navy'].includes(theme.palette.type)
}
export const zoom = (event: WheelEvent, element: HTMLDivElement) => {
  const { deltaY } = event
  const { clientX, clientY } = event
  const transformValue = element.style.getPropertyValue('transform')
  const scaleValue = Number.parseInt(transformValue ? transformValue.split('(')[1].split(')')[0].split(',')[0] : '1', 10)

  if (deltaY >= 0 && scaleValue > 1) {
    // zoom out
    console.log('zoom out')
    element.style.setProperty('transform', `scale(${scaleValue - 1})`)
  }
  // zoom in
  if (deltaY <= 0) {
    console.log('zoom in')
    element.style.setProperty('transform', `scale(${scaleValue + 1})`)
    element.style.setProperty('transform-origin', `${clientX}px ${clientY}px`)
    element.style.setProperty('transform-box', 'fill-box')
  }
}

export const sumReducer = (accumulator: number, currentValue: number) => accumulator + currentValue

export const extendStack = (stack: string[]): TExtendedStack => {
  return stack.map((item) => ({ value: item, isSelected: false }))
}

export const createCallIdentifier = (stackTrace: number[], type: TOpcodesNames) => {
  const stack = stackTrace.join('__')
  return stackTrace.length > 0 ? `${type}__${stack}` : `${type}__ROOT`
}

export const parseStackTrace = (stackTrace: number[]) => {
  return `[ ${stackTrace.join(' , ')} ]`
}

export const isArrayOfStrings = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export const getSignature = (fragment: FunctionFragment) => {
  const { inputs, name } = fragment

  return `${name}(${inputs.map((inputItem) => inputItem.type).join(',')})`
}

export const safeJsonParse = (data: string): unknown => {
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export const isJson = (str: string) => {
  try {
    JSON.parse(str)
  } catch {
    return false
  }
  return true
}
