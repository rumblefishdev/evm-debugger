import { combineReducers } from 'redux'

import { traceLogsReducer } from './traceLogs/traceLogs.slice'
import { structLogsReducer } from './structlogs/structlogs.slice'
import { sourceCodesReducer } from './sourceCodes/sourceCodes.slice'
import { sighashReducer } from './sighash/sighash.slice'
import { rawTxDataReducer } from './rawTxData/rawTxData.slice'
import { contractNamesReducer } from './contractNames/contractNames.slice'
import { bytecodesReducer } from './bytecodes/bytecodes.slice'
import { analyzerReducer } from './analyzer/analyzer.slice'
import { activeBlockReducer } from './activeBlock/activeBlock.slice'
import { sourceMapsReducer } from './sourceMaps/sourceMaps.slice'
import { StoreKeys } from './store.keys'
import { activeSourceFileReducer } from './activeSourceFile/activeSourceFile.slice'
import { instructionsReducer } from './instructions/instructions.slice'
import { activeStructLogReducer } from './activeStructLog/activeStructLog.slice'
import { uiReducer } from './ui/ui.slice'
import { transactionInfoReducer } from './transactionInfo/transactionInfo.slice'
import { transactionConfigReducer } from './transactionConfig/transactionConfig.slice'

export const rootReducer = combineReducers({
  [StoreKeys.TRACE_LOGS]: traceLogsReducer,
  [StoreKeys.STRUCT_LOGS]: structLogsReducer,
  [StoreKeys.ACTIVE_STRUCT_LOG]: activeStructLogReducer,
  [StoreKeys.SOURCE_CODES]: sourceCodesReducer,
  [StoreKeys.SIGHASH]: sighashReducer,
  [StoreKeys.RAW_TX_DATA]: rawTxDataReducer,
  [StoreKeys.CONTRACT_NAMES]: contractNamesReducer,
  [StoreKeys.BYTECODES]: bytecodesReducer,
  [StoreKeys.ANALYZER]: analyzerReducer,
  [StoreKeys.ACTIVE_BLOCK]: activeBlockReducer,
  [StoreKeys.SOURCE_MAPS]: sourceMapsReducer,
  [StoreKeys.ACTIVE_SOURCE_FILE]: activeSourceFileReducer,
  [StoreKeys.INSTRUCTIONS]: instructionsReducer,
  [StoreKeys.UI]: uiReducer,
  [StoreKeys.TRANSACTION_INFO]: transactionInfoReducer,
  [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
})
