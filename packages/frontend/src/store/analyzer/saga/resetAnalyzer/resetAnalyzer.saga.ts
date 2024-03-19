import { put } from 'typed-redux-saga'

import { transactionInfoActions } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions } from '../../../structlogs/structlogs.slice'
import { traceLogsActions } from '../../../traceLogs/traceLogs.slice'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { sighashActions } from '../../../sighash/sighash.slice'
import { disassembledBytecodesActions } from '../../../disassembledBytecodes/disassembledBytecodes.slice'
import { abisActions } from '../../../abis/abis.slice'
import { instructionsActions } from '../../../instructions/instructions.slice'
import { analyzerActions } from '../../analyzer.slice'
import { contractRawActions } from '../../../contractRaw/contractRaw.slice'
import { contractBaseActions } from '../../../contractBase/contractBase.slice'
import { sourceFilesActions } from '../../../sourceFiles/sourceFiles.slice'

export function* resetAnalyzerSaga() {
  yield* put(analyzerActions.clearAnalyzerInformation())
  yield* put(transactionConfigActions.clearTransactionConfig())
  yield* put(transactionInfoActions.clearTransactionInfo())
  yield* put(structLogsActions.clearStructLogs())

  yield* put(disassembledBytecodesActions.clearBytecodes())

  yield* put(contractRawActions.clearContractsRaw())
  yield* put(contractBaseActions.clearContractsBase())
  yield* put(sourceFilesActions.clearContractsSourceFiles())
  yield* put(abisActions.clearAbis())

  yield* put(instructionsActions.clearInstructions())
  yield* put(traceLogsActions.clearTraceLogs())
  yield* put(sighashActions.clearSighashes())
}
