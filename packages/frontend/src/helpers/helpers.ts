import type { TEventInfo, TOpCodes } from '@evm-debuger/types'
import { ethers } from 'ethers'

import type { TExtendedStack } from '../types'

export const itemSpacePercentageByGasCost = (
  gasCost: number,
  parentGasCost: number,
) => {
  const MAX_SPACE = 100
  const ROUNDING = 0

  // eslint-disable-next-line no-magic-numbers
  return Number.parseInt(
    ((gasCost / parentGasCost) * MAX_SPACE).toFixed(ROUNDING),
  )
}

export const zoom = (event: WheelEvent, element: HTMLDivElement) => {
  const { deltaY } = event
  const { clientX, clientY } = event
  const transformValue = element.style.getPropertyValue('transform')
  const scaleValue = Number.parseInt(
    transformValue
      ? transformValue.split('(')[1].split(')')[0].split(',')[0]
      : '1',
    10,
  )

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

export const sumReducer = (accumulator: number, currentValue: number) =>
  accumulator + currentValue

export const extendStack = (stack: string[]): TExtendedStack => {
  return stack.map((item) => ({ value: item, isSelected: false }))
}

export const convertNrToHexString = (nr: number | null) => {
  if (nr === null) return ''
  const defaultString = '0x0000'
  const hexValue = nr.toString(16)
  return (
    defaultString.slice(
      0,
      Math.max(0, defaultString.length - hexValue.length),
    ) + hexValue
  )
}

export const createCallIdentifier = (stackTrace: number[], type: TOpCodes) => {
  const stack = stackTrace.join('__')
  return stackTrace.length > 0 ? `${type}__${stack}` : `${type}__ROOT`
}

export const parseStackTrace = (stackTrace: number[]) => {
  return `[ ${stackTrace.join(' , ')} ]`
}

export const safeArgParse = (
  arg: string | ethers.BigNumber,
  type: 'address' | 'uint256' | string,
) => {
  const parsedArg = ethers.BigNumber.isBigNumber(arg)
    ? ethers.BigNumber.from(arg).toString()
    : arg

  if (type === 'uint256') return `${ethers.utils.formatEther(parsedArg)} ETH`
  return parsedArg
}

export const parseEventLog = (eventLogs: TEventInfo[]) => {
  return eventLogs.map((eventLog) => {
    const { eventDescription } = eventLog
    const { name, signature, args, eventFragment, topic } = eventDescription
    const { inputs } = eventFragment

    const parsedArgs = inputs.map((input, index) => {
      const value = args[index]

      const parsedValue = safeArgParse(value, input.type)

      return { value: parsedValue, type: input.type, name: input.name }
    })

    return { signature, parsedArgs, name }
  })
}

export const parseFunctionFragment = (
  input: ethers.utils.TransactionDescription,
) => {
  const { name, args, signature, functionFragment, sighash } = input
  const { inputs, outputs, gas } = functionFragment

  const parsedInputs = inputs.map((inputItem, index) => {
    const value = args[index]

    const parsedValue = safeArgParse(value, inputItem.type)

    return { value: parsedValue, type: inputItem.type, name: inputItem.name }
  })

  const parsedOutputs = outputs.map((outputItem, index) => {
    const value = args[index]

    const parsedValue = safeArgParse(value, outputItem.type)

    return { value: parsedValue, type: outputItem.type, name: outputItem.name }
  })

  return { signature, sighash, parsedOutputs, parsedInputs, name, gas }
}
