import { TxAnalyzer } from '@evm-debuger/analyzer'
import { apply, put } from 'typed-redux-saga'

import { addBytecodes } from '../bytecodes/bytecodes.slice'
import { setContractAddresses, setTxInfo } from '../rawTxData/rawTxData.slice'
import { addSighashes } from '../sighash/sighash.slice'
import { addSourceCodes } from '../sourceCodes/sourceCodes.slice'
import { loadStructLogs } from '../structlogs/structlogs.slice'
import { loadTraceLogs } from '../traceLogs/traceLogs.slice'

import { analyzerActions } from './analyzer.slice'

export function* runAnalyzer(
  action: ReturnType<typeof analyzerActions.runAnalyzer>,
) {
  yield* put(analyzerActions.reset())
  try {
    yield* put(analyzerActions.logMessage('Fetching txInfo'))
    const transactionInfo = yield* apply(
      action.payload.txInfoProvider,
      action.payload.txInfoProvider.getTxInfo,
      [],
    )
    yield* put(analyzerActions.logMessage('Success!'))
    yield* put(setTxInfo(transactionInfo))

    yield* put(analyzerActions.logMessage('Fetching structLogs'))
    const structLogs = yield* apply(
      action.payload.structLogProvider,
      action.payload.structLogProvider.getStructLog,
      [],
    )
    yield* put(analyzerActions.logMessage('Success!'))
    yield* put(loadStructLogs(structLogs))

    yield* put(analyzerActions.logMessage('Calling analyzer'))
    // TODO: fetch abis from some selector in store
    const analyzer = new TxAnalyzer({ transactionInfo, structLogs, abis: {} })
    const { mainTraceLogList, analyzeSummary } = yield* apply(
      analyzer,
      analyzer.analyze,
      [],
    )

    yield* put(loadTraceLogs(mainTraceLogList))
    yield* put(setContractAddresses(analyzeSummary.contractAddresses))
    yield* put(addSighashes(analyzeSummary.contractSighashesInfo))
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

    yield* put(analyzerActions.setLoading(false))
  } catch (error) {
    yield* put(analyzerActions.setLoading(false))
    yield* put(analyzerActions.logMessage('Failed!'))
    yield* put(analyzerActions.setError(error.toString()))
  }
}
