import type { TCallTypeData, TEventInfo } from '@evm-debuger/types'
import { createSelector } from '@reduxjs/toolkit'
import type { ErrorDescription } from 'ethers'
import { checkOpcodeIfOfCallGroupType } from '@evm-debuger/analyzer'

import { getSignature, parseStackTrace } from '../../helpers/helpers'
import type { TParsedEventLog } from '../../types'
import type { TMainTraceLogsWithId } from '../traceLogs/traceLogs.types'
import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'

import type { TBlockCallSpecificData, TParsedActiveBlock, TParsedCallTypeData } from './activeBlock.types'
import { parseParameter, parseParameters } from './activeBlock.utils'

const selectActiveBlockState = createSelector([selectReducer(StoreKeys.ACTIVE_BLOCK)], (state) => state)

const parseEventLog = (eventLogs: TEventInfo[]): TParsedEventLog[] => {
  return eventLogs.map((eventLog) => {
    if (!eventLog.eventDescription) return { signature: null, parsedArgs: null, name: null }
    const { eventDescription } = eventLog
    const { name, signature, args, fragment } = eventDescription
    const { inputs } = fragment
    const parsedArgs = inputs.map((parameterType, index) => {
      const parameterValue = args[index]
      return parseParameter(parameterType, parameterValue)
    })

    return { signature, parsedArgs, name }
  })
}

const parseActiveBlock = (block: TMainTraceLogsWithId, contractName: string | null) => {
  // eslint-disable-next-line unicorn/consistent-destructuring
  const { callTypeData } = block

  const callResult: TParsedCallTypeData = {
    ...block.callTypeData,
    parsedOutput: null,
    parsedInput: null,
    parsedError: null,
    functionSignature: null,
    functionFragment: null,
    events: parseEventLog(callTypeData.events),
    errorSignature: null,
    contractName,
  }

  if (callTypeData.functionFragment) {
    const { inputs, outputs } = callTypeData.functionFragment

    const parsedInput = parseParameters([...inputs], callTypeData.decodedInput)
    const parsedOutput = parseParameters([...outputs], callTypeData.decodedOutput)

    const signature = getSignature(callTypeData.functionFragment)

    callResult.parsedInput = parsedInput
    callResult.parsedOutput = parsedOutput
    callResult.functionSignature = signature
  }

  if (callTypeData.errorDescription) {
    const { signature, fragment, args } = callTypeData.errorDescription
    const { inputs } = fragment

    const parsedError = parseParameters([...inputs], args)

    callResult.errorSignature = signature
    callResult.parsedError = parsedError
  }

  const result: TParsedActiveBlock = { ...block, stackTrace: parseStackTrace(block.stackTrace), callTypeData: callResult }

  return result
}

export const selectParsedActiveBlock = createSelector(
  [selectActiveBlockState, contractNamesSelectors.selectEntities],
  (activeBlock, contractNames) => {
    const contract = contractNames[activeBlock.address]
    const contractNameString = contract?.contractName ?? null
    return parseActiveBlock(activeBlock, contractNameString)
  },
)

export const selectActiveBlock = createSelector([selectActiveBlockState], (state) => state)

export const extractErrorInfoFromErrorDescription = (errorDescription: ErrorDescription) => {
  const { signature, args } = errorDescription

  if (args.length === 0) return signature

  return args[0]
}

export const getTraceLogErrorOutput = (block: TMainTraceLogsWithId) => {
  const errorSignature =
    checkOpcodeIfOfCallGroupType(block.op) && block.callTypeData?.errorDescription
      ? extractErrorInfoFromErrorDescription(block.callTypeData?.errorDescription)
      : null

  return errorSignature ? errorSignature : 'Revert (no revert message was provided)'
}

export const activeBlockSelectors = { selectParsedActiveBlock, selectActiveBlock }
