import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'
import type { TEventInfo } from '@evm-debuger/types'
import { createSelector } from '@reduxjs/toolkit'

import { getSignature, parseStackTrace } from '../../helpers/helpers'
import type { TParsedEventLog } from '../../types'
import type { TRootState } from '../store'
import type { TMainTraceLogsWithId } from '../traceLogs/traceLogs.types'
import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'

import type { TBlockCallSpecificData, TParsedActiveBlock } from './activeBlock.types'
import { parseParameter, parseParameters } from './activeBlock.utils'

const selectActiveBlockState = createSelector([selectReducer(StoreKeys.ACTIVE_BLOCK)], (state) => state)

const parseEventLog = (eventLogs: TEventInfo[]): TParsedEventLog[] => {
  return eventLogs.map((eventLog) => {
    if (!eventLog.eventDescription) return { signature: null, parsedArgs: null, name: null }
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

const parseActiveBlock = (block: TMainTraceLogsWithId, contractName: string | null) => {
  const result: TParsedActiveBlock = {
    defaultData: null,
    createSpecificData: null,
    callSpecificData: null,
  }

  const { address, gasCost, passedGas, stackTrace, type, value, blockNumber, isSuccess, startIndex, returnIndex } = block
  result.defaultData = {
    value,
    type,
    startIndex,
    stackTrace: parseStackTrace(stackTrace),
    returnIndex,
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
  [selectActiveBlockState, contractNamesSelectors.selectAll],
  (activeBlock, contractNames) => {
    const contract = contractNames.find((contractName) => contractName.address === activeBlock.address)
    const contractNameString = contract?.contractName ?? null
    return parseActiveBlock(activeBlock, contractNameString)
  },
)

export const selectActiveBlock = createSelector([selectActiveBlockState], (state) => state)

export const getTraceLogErrorOutput = (block: TMainTraceLogsWithId) => {
  const errorSignature = checkIfOfCallType(block) ? block.errorDescription?.signature : null

  return errorSignature ? errorSignature : 'Revert (no revert message was provided)'
}

export const activeBlockSelectors = { selectParsedActiveBlock, selectActiveBlock }
