import { put } from 'typed-redux-saga'

import { transactionInfoActions } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions } from '../../../structlogs/structlogs.slice'
import { contractsActions } from '../../../contracts/contracts.slice'
import { traceLogsActions } from '../../../traceLogs/traceLogs.slice'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { sighashActions } from '../../../sighash/sighash.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'
import { sourceMapsActions } from '../../../sourceMaps/sourceMaps.slice'
import { abisActions } from '../../../abis/abis.slice'
import { instructionsActions } from '../../../instructions/instructions.slice'
import { analyzerActions } from '../../analyzer.slice'

export function* resetAnalyzerSaga() {
  yield* put(analyzerActions.clearAnalyzerInformation())
  yield* put(transactionConfigActions.clearTransactionConfig())
  yield* put(transactionInfoActions.clearTransactionInfo())
  yield* put(structLogsActions.clearStructLogs())

  yield* put(contractsActions.clearContractNames())
  yield* put(bytecodesActions.clearBytecodes())

  yield* put(sourceCodesActions.clearSourceCodes())
  yield* put(sourceMapsActions.clearSourceMaps())
  yield* put(abisActions.clearAbis())

  yield* put(instructionsActions.clearInstructions())
  yield* put(traceLogsActions.clearTraceLogs())
  yield* put(sighashActions.clearSighashes())
}
