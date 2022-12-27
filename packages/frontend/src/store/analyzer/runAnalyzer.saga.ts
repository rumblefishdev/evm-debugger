import { TxAnalyzer } from '@evm-debuger/analyzer'
import type { IStructLog, TAbis, TTransactionInfo } from '@evm-debuger/types'
import { apply, put, select } from 'typed-redux-saga'

import { createCallIdentifier } from '../../helpers/helpers'
import { loadActiveBlock } from '../activeBlock/activeBlock.slice'
import { addBytecodes } from '../bytecodes/bytecodes.slice'
import { setContractAddresses, setTxInfo } from '../rawTxData/rawTxData.slice'
import { sighashSelectors } from '../sighash/sighash.selectors'
import { addSighashes } from '../sighash/sighash.slice'
import { addSourceCodes } from '../sourceCodes/sourceCodes.slice'
import { loadStructLogs } from '../structlogs/structlogs.slice'
import { addTraceLogs } from '../traceLogs/traceLogs.slice'

import { analyzerActions } from './analyzer.slice'
import type { IAbiProvider } from './analyzer.types'

function* callAnalyzerOnce(
  transactionInfo: TTransactionInfo,
  structLogs: IStructLog[],
  additionalAbis: TAbis = {},
) {
  yield* put(analyzerActions.logMessage('Calling analyzer'))
  const abis = yield* select(sighashSelectors.abis)
  const analyzer = new TxAnalyzer({
    transactionInfo,
    structLogs,
    abis: { ...abis, ...additionalAbis },
  })
  const { mainTraceLogList, analyzeSummary } = yield* apply(
    analyzer,
    analyzer.analyze,
    [],
  )
  yield* put(addTraceLogs(mainTraceLogList))
  yield* put(
    loadActiveBlock({
      ...mainTraceLogList[0],
      id: createCallIdentifier(
        mainTraceLogList[0].stackTrace,
        mainTraceLogList[0].type,
      ),
    }),
  )
  yield* put(addSighashes(analyzeSummary.contractSighashesInfo))
  return analyzeSummary
}

function* fetchAdditionalAbis(
  abiProvider: IAbiProvider,
  addresses: Set<string>,
) {
  const additionalAbis = {}
  for (const address of addresses.values())
    try {
      yield* put(
        analyzerActions.logMessage(`Trying to fetch abi of ${address}`),
      )
      const abi = yield* apply(abiProvider, abiProvider.getAbi, [address])
      if (!abi) throw new Error(`No abi for ${address}`)

      additionalAbis[address] = abi
      yield* put(analyzerActions.logMessage(`Success`))
    } catch (error) {
      yield* put(analyzerActions.logMessage(error.toString()))
    }

  return additionalAbis
}

export function* runAnalyzer(
  action: ReturnType<typeof analyzerActions.runAnalyzer>,
) {
  const { txInfoProvider, structLogProvider, abiProvider } = action.payload
  yield* put(analyzerActions.reset())
  yield* put(analyzerActions.setLoading(true))

  try {
    yield* put(analyzerActions.logMessage('Fetching txInfo'))
    const transactionInfo = yield* apply(
      txInfoProvider,
      txInfoProvider.getTxInfo,
      [],
    )
    yield* put(analyzerActions.logMessage('Success!'))
    yield* put(setTxInfo(transactionInfo))

    yield* put(analyzerActions.logMessage('Fetching structLogs'))
    const structLogs = yield* apply(
      structLogProvider,
      structLogProvider.getStructLog,
      [],
    )
    yield* put(analyzerActions.logMessage('Success!'))
    yield* put(loadStructLogs(structLogs))

    const analyzeSummary = yield* callAnalyzerOnce(transactionInfo, structLogs)

    yield* put(setContractAddresses(analyzeSummary.contractAddresses))
    yield* put(
      addBytecodes(
        analyzeSummary.contractAddresses.map((address) => ({
          error: null,
          disassembled: null,
          bytecode: null,
          address,
        })),
      ),
    )
    yield* put(
      addSourceCodes(
        analyzeSummary.contractAddresses.map((address) => ({
          sourceCode: null,
          address,
        })),
      ),
    )

    yield* put(analyzerActions.logMessage('Calculating address to fetch ABIs!'))
    const addresses = yield* select(sighashSelectors.addressesWithMissingAbis)
    if (addresses.size === 0)
      yield* put(analyzerActions.logMessage('No more abis to fetch.'))
    else {
      const additionalAbis = yield* fetchAdditionalAbis(abiProvider, addresses)
      const additionalAbisCount = Object.keys(additionalAbis).length
      if (additionalAbisCount === 0)
        yield* put(
          analyzerActions.logMessage('No additional abis were fetched.'),
        )
      else {
        yield* put(
          analyzerActions.logMessage(
            `${additionalAbisCount} were fetched. Calling analyzer again`,
          ),
        )
        yield* callAnalyzerOnce(transactionInfo, structLogs, additionalAbis)
      }
    }

    yield* put(analyzerActions.setLoading(false))
  } catch (error) {
    yield* put(analyzerActions.setLoading(false))
    yield* put(analyzerActions.logMessage('Failed!'))
    yield* put(analyzerActions.setError(error.toString()))
  }
}
