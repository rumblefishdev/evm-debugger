import { put } from 'typed-redux-saga'

import { analyzerActions } from '../../analyzer.slice'
import { transactionInfoActions } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions } from '../../../structlogs/structlogs.slice'
import { contractNamesActions } from '../../../contractNames/contractNames.slice'
import { traceLogsActions } from '../../../traceLogs/traceLogs.slice'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { sighashActions } from '../../../sighash/sighash.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'
import { sourceMapsActions } from '../../../sourceMaps/sourceMaps.slice'
import { abisActions } from '../../../abis/abis.slice'
import { instructionsActions } from '../../../instructions/instructions.slice'

export function* clearAnalyzerInformationSaga() {
  yield put(transactionConfigActions.clearTransactionConfig())
  yield put(transactionInfoActions.clearTransactionInfo())
  yield put(structLogsActions.clearStructLogs())

  yield put(contractNamesActions.clearContractNames())
  yield put(bytecodesActions.clearBytecodes())

  yield put(sourceCodesActions.clearSourceCodes())
  yield put(sourceMapsActions.clearSourceMaps())
  yield put(abisActions.clearAbis())

  yield put(instructionsActions.clearInstructions())
  yield put(traceLogsActions.clearTraceLogs())
  yield put(sighashActions.clearSighashes())
}
