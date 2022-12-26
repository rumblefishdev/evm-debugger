import { TxAnalyzer } from '@evm-debuger/analyzer'
import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'
import { apply, put, select } from 'typed-redux-saga'

import { addBytecodes } from '../bytecodes/bytecodes.slice'
import { setContractAddresses, setTxInfo } from '../rawTxData/rawTxData.slice'
import { sighashSelectors } from '../sighash/sighash.selectors'
import { addSighashes } from '../sighash/sighash.slice'
import { addSourceCodes } from '../sourceCodes/sourceCodes.slice'
import { loadStructLogs } from '../structlogs/structlogs.slice'
import { loadTraceLogs } from '../traceLogs/traceLogs.slice'

import { analyzerActions } from './analyzer.slice'

function* callAnalyzerOnce(
  transactionInfo: TTransactionInfo,
  structLogs: IStructLog[],
) {
  yield* put(analyzerActions.logMessage('Calling analyzer'))
  const abis = yield* select(sighashSelectors.abis)
  const analyzer = new TxAnalyzer({ transactionInfo, structLogs, abis })
  const { mainTraceLogList, analyzeSummary } = yield* apply(
    analyzer,
    analyzer.analyze,
    [],
  )
  yield* put(loadTraceLogs(mainTraceLogList))
  yield* put(addSighashes(analyzeSummary.contractSighashesInfo))
  return analyzeSummary
}

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

    yield* put(analyzerActions.setLoading(false))
  } catch (error) {
    yield* put(analyzerActions.setLoading(false))
    yield* put(analyzerActions.logMessage('Failed!'))
    yield* put(analyzerActions.setError(error.toString()))
  }
}
