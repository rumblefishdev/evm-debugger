import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'
import type { TEventInfo } from '@evm-debuger/types'
import { createSelector } from '@reduxjs/toolkit'
import type { ethers } from 'ethers'

import {
  getSignature,
  parseStackTrace,
} from '../../helpers/helpers'
import type { TMainTraceLogsWithId, TParsedEventLog } from '../../types'
import { contractNamesSelectors } from '../contractNames/contractNames'
import type { TRootState } from '../store'

import type {
  TBlockCallSpecificData,
  TParsedActiveBlock,
} from './activeBlock.types'
import { parseParameter } from './activeBlock.utils'

const parseEventLog = (eventLogs: TEventInfo[]): TParsedEventLog[] => {
  return eventLogs.map((eventLog) => {
    if (!eventLog.eventDescription)
      return { signature: null, parsedArgs: null, name: null }
    const { eventDescription } = eventLog
    const { name, signature, args, eventFragment } = eventDescription
    const { inputs } = eventFragment
    const parsedArgs = inputs.map((parameterType, index) => {
      const parameterValue = args[index]
      return parseParameter(parameterType, parameterValue)
    })

    return { signature, parsedArgs, name }
  })
}

const parseParameters = (
  params: ethers.utils.ParamType[],
  result: ethers.utils.Result,
) => {
  return params.map((parameterType, index) => {
    const parameterValue = result[index]
    return parseParameter(parameterType, parameterValue)
  })
}

const parseActiveBlock = ([block, contractName]: [
  TMainTraceLogsWithId,
  string | null,
]) => {
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

  // eslint-disable-next-line unicorn/consistent-destructuring
  if (checkIfOfCallType(block) && block.isContract) {
    const {
      events,
      functionFragment,
      errorDescription,
      decodedInput,
      decodedOutput,
      storageAddress,
      storageLogs,
      input,
      output,
      isContract,
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
      contractName,
    }

    console.log(callResult.parsedEvents)
    if (functionFragment) {
      const { inputs, outputs } = functionFragment

      const parsedInput = parseParameters(inputs, decodedInput)
      const parsedOutput = parseParameters(outputs, decodedOutput)

      const signature = getSignature(functionFragment)

      callResult.parsedInput = parsedInput
      callResult.parsedOutput = parsedOutput
      callResult.functionSignature = signature
    }

    if (errorDescription) {
      const { signature, errorFragment, args } = errorDescription
      const { inputs } = errorFragment

      const parsedError = parseParameters(inputs, args)

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
  ({ activeBlock, contractNames }: TRootState) => {
    const contractName =
      contractNamesSelectors.selectById(contractNames, activeBlock.address)
        ?.contractName ?? null
    return [activeBlock, contractName]
  },
  parseActiveBlock,
)

export const getReadableBlockOutput = (block: TMainTraceLogsWithId) => {
  const output = JSON.stringify(
    checkIfOfCallType(block)
      ? block.decodedOutput?.[0] ?? block.output ?? null
      : null,
  )

  return output === 'null' ? null : output
}
