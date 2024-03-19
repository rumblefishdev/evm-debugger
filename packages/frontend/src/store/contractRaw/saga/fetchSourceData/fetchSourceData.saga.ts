import { apply, call, put, type SagaGenerator } from 'typed-redux-saga'
import type { TEtherscanContractSourceCodeResult, TSourceData } from '@evm-debuger/types'

import { traceStorageBucket } from '../../../../config'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createErrorLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'
import type { ContractRawActions } from '../../contractRaw.slice'

export async function fetchSourceData(sourceDataPath: string) {
  const rawSourceData = await fetch(`https://${traceStorageBucket}/${sourceDataPath}`)
  const sourceData: TEtherscanContractSourceCodeResult = await rawSourceData.json()
  return sourceData
}

export async function fetchSourcesOrder(sourcesPath: string) {
  const rawSources = await fetch(`https://${traceStorageBucket}/${sourcesPath}`)
  const sources: Record<number, string> = await rawSources.json()
  return sources
}

export function* fetchSourceDataForContractSaga({ payload }: ContractRawActions['fetchSourceData']): SagaGenerator<void> {
  const { sourceDataPath, sourcesPath, contractAddress } = payload
  const analyzer = yield* call(getAnalyzerInstance)

  try {
    const etherscanSourceData = yield* call(fetchSourceData, sourceDataPath)
    const sourcesOrder = yield* call(fetchSourcesOrder, sourcesPath)
    if (etherscanSourceData.ABI) {
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
        contractAddress,
        'applicationBinaryInterface',
        etherscanSourceData.ABI,
      ])
    }
    if (etherscanSourceData.SourceCode) {
      const sourceData: TSourceData = {
        swarmSource: etherscanSourceData.SwarmSource,
        runs: etherscanSourceData.Runs,
        proxy: etherscanSourceData.Proxy,
        optimizationUsed: etherscanSourceData.OptimizationUsed,
        licenseType: etherscanSourceData.LicenseType,
        library: etherscanSourceData.Library,
        implementation: etherscanSourceData.Implementation,
        evmVersion: etherscanSourceData.EVMVersion,
        contractName: etherscanSourceData.ContractName,
        constructorArguments: etherscanSourceData.ConstructorArguments,
        compilerVersion: etherscanSourceData.CompilerVersion,
      }

      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
        contractAddress,
        'sourceCode',
        etherscanSourceData.SourceCode,
      ])
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [contractAddress, 'sourceFilesOrder', sourcesOrder])
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [contractAddress, 'sourceData', sourceData])
    }

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Source data for ${contractAddress} fetched successfully`)))
  } catch (error) {
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Source data for ${contractAddress} fetching failed`)))
    console.log(error)
  }
}
