import { combineReducers } from 'redux'

import { traceLogsReducer } from './traceLogs/traceLogs.slice'
import { structLogsReducer } from './structlogs/structlogs.slice'
import { sourceCodesReducer } from './sourceCodes/sourceCodes.slice'
import { sighashReducer } from './sighash/sighash.slice'
import { bytecodesReducer } from './bytecodes/bytecodes.slice'
import { activeBlockReducer } from './activeBlock/activeBlock.slice'
import { sourceMapsReducer } from './sourceMaps/sourceMaps.slice'
import { StoreKeys } from './store.keys'
import { activeSourceFileReducer } from './activeSourceFile/activeSourceFile.slice'
import { instructionsReducer } from './instructions/instructions.slice'
import { activeStructLogReducer } from './activeStructLog/activeStructLog.slice'
import { uiReducer } from './ui/ui.slice'
import { transactionInfoReducer } from './transactionInfo/transactionInfo.slice'
import { transactionConfigReducer } from './transactionConfig/transactionConfig.slice'
import { analyzerReducer } from './analyzer/analyzer.slice'
import { abisReducer } from './abis/abis.slice'
import { activeLineReducer } from './activeLine/activeLine.slice'
import { yulNodesReducer } from './yulNodes/yulNodes.slice'
import { sourceFilesReducer } from './sourceFiles/sourceFiles.slice'
import { contractBaseReducer } from './contractBase/contractBase.slice'
import { contractRawReducer } from './contractRaw/contractRaw.slice'

export const rootReducer = combineReducers({
  [StoreKeys.TRACE_LOGS]: traceLogsReducer,
  [StoreKeys.STRUCT_LOGS]: structLogsReducer,
  [StoreKeys.ACTIVE_STRUCT_LOG]: activeStructLogReducer,
  [StoreKeys.SOURCE_CODES]: sourceCodesReducer,
  [StoreKeys.SIGHASH]: sighashReducer,
  [StoreKeys.BYTECODES]: bytecodesReducer,
  [StoreKeys.ANALYZER]: analyzerReducer,
  [StoreKeys.ACTIVE_BLOCK]: activeBlockReducer,
  [StoreKeys.SOURCE_MAPS]: sourceMapsReducer,
  [StoreKeys.ACTIVE_SOURCE_FILE]: activeSourceFileReducer,
  [StoreKeys.INSTRUCTIONS]: instructionsReducer,
  [StoreKeys.UI]: uiReducer,
  [StoreKeys.TRANSACTION_INFO]: transactionInfoReducer,
  [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
  [StoreKeys.ABIS]: abisReducer,
  [StoreKeys.ACTIVE_LINE]: activeLineReducer,
  [StoreKeys.YUL_NODES]: yulNodesReducer,
  [StoreKeys.SOURCE_FILES]: sourceFilesReducer,
  [StoreKeys.CONTRACT_BASE]: contractBaseReducer,
  [StoreKeys.CONTRACT_RAW]: contractRawReducer,
})
