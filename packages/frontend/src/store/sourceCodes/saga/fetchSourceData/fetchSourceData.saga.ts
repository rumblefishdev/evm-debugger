import { call, put, type SagaGenerator } from 'typed-redux-saga'
import type { TEtherscanContractSourceCodeResult } from '@evm-debuger/types'

import { traceStorageBucket } from '../../../../config'
import { sourceCodesActions, type SourceCodesActions } from '../../sourceCodes.slice'
import { contractNamesActions } from '../../../contractNames/contractNames.slice'
import { abisActions } from '../../../abis/abis.slice'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createErrorLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'

export async function fetchSourceData(sourceDataPath: string) {
  const rawSourceData = await fetch(`https://${traceStorageBucket}/${sourceDataPath}`)
  const sourceData: TEtherscanContractSourceCodeResult = await rawSourceData.json()
  return sourceData
}

export async function fetchSources(sourcesPath: string) {
  const rawSources = await fetch(`https://${traceStorageBucket}/${sourcesPath}`)
  const sources: Record<number, string> = await rawSources.json()
  return sources
}

export function* fetchSourceDataForContractSaga({ payload }: SourceCodesActions['fetchSourceData']): SagaGenerator<void> {
  const { sourceDataPath, sourcesPath, contractAddress } = payload

  try {
    const sourceData = yield* call(fetchSourceData, sourceDataPath)
    const sourcesOrder = yield* call(fetchSources, sourcesPath)
    if (sourceData.ABI) {
      yield* put(abisActions.addAbi({ address: contractAddress, abi: sourceData.ABI }))
    }
    if (sourceData.SourceCode) {
      yield* put(sourceCodesActions.addSourceCode({ sourcesOrder, sourceCode: sourceData.SourceCode, address: contractAddress }))
    }
    if (sourceData.ContractName) {
      yield* put(contractNamesActions.updateContractName({ id: contractAddress, changes: { contractName: sourceData.ContractName } }))
    }

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Source data for ${contractAddress} fetched successfully`)))
  } catch (error) {
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Source data for ${contractAddress} fetching failed`)))
    console.log(error)
  }
}
