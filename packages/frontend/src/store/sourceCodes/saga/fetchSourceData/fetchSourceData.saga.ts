import { call, put, type SagaGenerator } from 'typed-redux-saga'
import type { TEtherscanContractSourceCodeResult } from '@evm-debuger/types'

import { traceStorageBucket } from '../../../../config'
import { sourceCodesActions, type SourceCodesActions } from '../../sourceCodes.slice'
import { contractNamesActions } from '../../../contractNames/contractNames.slice'
import { abisActions } from '../../../abis/abis.slice'

export async function fetchSourceData(sourceDataPath: string) {
  const rawSourceData = await fetch(`https://${traceStorageBucket}/${sourceDataPath}`)
  const sourceData: TEtherscanContractSourceCodeResult = await rawSourceData.json()
  return sourceData
}

export function* fetchSourceDataForContractSaga({ payload }: SourceCodesActions['fetchSourceData']): SagaGenerator<void> {
  const { path, contractAddress } = payload

  try {
    const sourceData = yield* call(fetchSourceData, path)
    if (sourceData.ABI) {
      yield* put(abisActions.addAbi({ address: contractAddress, abi: sourceData.ABI }))
    }
    if (sourceData.SourceCode) {
      yield* put(sourceCodesActions.addSourceCode({ sourceCode: sourceData.SourceCode, address: contractAddress }))
    }
    if (sourceData.ContractName) {
      yield* put(contractNamesActions.updateContractName({ id: contractAddress, changes: { contractName: sourceData.ContractName } }))
    }
  } catch (error) {
    console.log(error)
  }
}
