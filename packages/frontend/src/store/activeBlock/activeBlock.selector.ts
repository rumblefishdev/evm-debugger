import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'
import type {
  TCallTypeOpcodes,
  TCreateTypeOpcodes,
  TEventInfo,
  TStorageLogs,
} from '@evm-debuger/types'
import { createSelector } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

import {
  getSignature,
  isArrayOfStrings,
  parseStackTrace,
} from '../../helpers/helpers'
import type { TMainTraceLogsWithId, TParsedEventLog } from '../../types'
import type { TRootState } from '../store'

import type {
  TBlockCallSpecificData,
  TParsedActiveBlock,
} from './activeBlock.types'

const safeArgParse = (
  arg:
    | string
    | ethers.BigNumber
    | boolean
    | string[]
    | ethers.utils.BytesLike
    | ethers.BigNumber[],
  param: ethers.utils.ParamType,
) => {
  const { type } = param

  if (type === 'tuple') {
    const { components } = param
    return components.map((component, index) => {
      const value = arg[index]

      const parsedValue = safeArgParse(value, component)

      return { value: parsedValue, type: component.type, name: component.name }
    })
  }

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

  if (typeof arg === 'boolean') return arg ? 'true' : 'false'

  if (type === 'bytes' && ethers.utils.isBytesLike(arg)) return arg.toString()

  if (type === 'uint256')
    return `${ethers.utils.formatEther(
      ethers.BigNumber.from(arg).toString(),
    )} ETH
    `

  return arg
}

const parseEventLog = (eventLogs: TEventInfo[]): TParsedEventLog[] => {
  return eventLogs.map((eventLog) => {
    if (!eventLog.eventDescription)
      return { signature: null, parsedArgs: null, name: null }
    const { eventDescription } = eventLog
    const { name, signature, args, eventFragment, topic } = eventDescription
    const { inputs } = eventFragment

    const parsedArgs = inputs.map((input, index) => {
      const value = args[index]

      const parsedValue = safeArgParse(value, input)

      return { value: parsedValue, type: input.type, name: input.name }
    })

    return { signature, parsedArgs, name }
  })
}

const parseParams = (
  params: ethers.utils.ParamType[],
  result: ethers.utils.Result,
) => {
  return params.map((paramItem, index) => {
    const value = result[index]

    const parsedValue = safeArgParse(value, paramItem)

    return { value: parsedValue, type: paramItem.type, name: paramItem.name }
  })
}

const parseActiveBlock = (block: TMainTraceLogsWithId) => {
  const result: TParsedActiveBlock = {
    defaultData: null,
    createSpecificData: null,
    callSpecificData: null,
  }

  const {
    address,
    gasCost,
    passedGas,
    stackTrace,
    type,
    value,
    blockNumber,
    isSuccess,
  } = block
  result.defaultData = {
    value,
    type,
    stackTrace: parseStackTrace(stackTrace),
    passedGas,
    isSuccess,
    gasCost,
    blockNumber,
    address,
  }

  if (checkIfOfCallType(block) && block.isContract) {
    const {
      events,
      functionFragment,
      errorDescription,
      decodedInput,
      decodedOutput,
      isContract,
      storageAddress,
      storageLogs,
      input,
      output,
    } = block

    const callResult: TBlockCallSpecificData = {
      storageLogs,
      storageAddress,
      parsedOutput: null,
      parsedInput: null,
      parsedEvents: parseEventLog(events),
      parsedError: null,
      output,
      isContract,
      input,
      functionSignature: null,
      errorSignature: null,
    }

    if (functionFragment) {
      const { inputs, outputs } = functionFragment

      const parsedInput = parseParams(inputs, decodedInput)
      const parsedOutput = parseParams(outputs, decodedOutput)

      const signature = getSignature(functionFragment)

      callResult.parsedInput = parsedInput
      callResult.parsedOutput = parsedOutput
      callResult.functionSignature = signature
    }

    if (errorDescription) {
      const { signature, errorFragment, args } = errorDescription
      const { inputs } = errorFragment

      const parsedError = parseParams(inputs, args)

      callResult.errorSignature = signature
      callResult.parsedError = parsedError
    }

    result.callSpecificData = callResult
  }

  if (checkIfOfCreateType(block)) {
    const { storageAddress, storageLogs, salt, input } = block

    result.createSpecificData = { storageLogs, storageAddress, salt, input }
  }

  return result
}

export const selectParsedActiveBlock = createSelector(
  (state: TRootState) => state.activeBlock,
  parseActiveBlock,
)
