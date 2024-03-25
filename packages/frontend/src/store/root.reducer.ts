import { combineReducers } from 'redux'

import { traceLogsReducer } from './traceLogs/traceLogs.slice'
import { structLogsReducer } from './structlogs/structlogs.slice'
import { sighashReducer } from './sighash/sighash.slice'
import { activeBlockReducer } from './activeBlock/activeBlock.slice'
import { StoreKeys } from './store.keys'
import { instructionsReducer } from './instructions/instructions.slice'
import { activeStructLogReducer } from './activeStructLog/activeStructLog.slice'
import { uiReducer } from './ui/ui.slice'
import { transactionInfoReducer } from './transactionInfo/transactionInfo.slice'
import { transactionConfigReducer } from './transactionConfig/transactionConfig.slice'
import { analyzerReducer } from './analyzer/analyzer.slice'
import { activeLineReducer } from './activeLine/activeLine.slice'
import { yulNodesReducer } from './yulNodes/yulNodes.slice'
import { sourceFilesReducer } from './sourceFiles/sourceFiles.slice'
import { contractBaseReducer } from './contractBase/contractBase.slice'
import { contractRawReducer } from './contractRaw/contractRaw.slice'
import { disassembledBytecodesReducer } from './disassembledBytecodes/disassembledBytecodes.slice'
import { functionStackReducer } from './functionStacks/functionStack.slice'

export const rootReducer = combineReducers({
  [StoreKeys.TRACE_LOGS]: traceLogsReducer,
  [StoreKeys.STRUCT_LOGS]: structLogsReducer,
  [StoreKeys.ACTIVE_STRUCT_LOG]: activeStructLogReducer,
  [StoreKeys.SIGHASH]: sighashReducer,
  [StoreKeys.DISASSEMBLED_BYTECODES]: disassembledBytecodesReducer,
  [StoreKeys.ANALYZER]: analyzerReducer,
  [StoreKeys.ACTIVE_BLOCK]: activeBlockReducer,
  [StoreKeys.INSTRUCTIONS]: instructionsReducer,
  [StoreKeys.UI]: uiReducer,
  [StoreKeys.TRANSACTION_INFO]: transactionInfoReducer,
  [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
  [StoreKeys.ACTIVE_LINE]: activeLineReducer,
  [StoreKeys.YUL_NODES]: yulNodesReducer,
  [StoreKeys.SOURCE_FILES]: sourceFilesReducer,
  [StoreKeys.CONTRACT_BASE]: contractBaseReducer,
  [StoreKeys.CONTRACT_RAW]: contractRawReducer,
  [StoreKeys.FUNCTION_STACK]: functionStackReducer,
})
