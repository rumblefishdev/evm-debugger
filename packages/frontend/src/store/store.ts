import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import { activeBlockReducer } from './activeBlock/activeBlock.slice'
import { structLogsReducer } from './structlogs/structlogs.slice'
import { bytecodesReducer } from './bytecodes/bytecodes.slice'
import { analyzerReducer } from './analyzer/analyzer.slice'
import { rawTxDataReducer } from './rawTxData/rawTxData.slice'
import { sighashReducer } from './sighash/sighash.slice'
import { sourceCodesReducer } from './sourceCodes/sourceCodes.slice'
import { traceLogsReducer } from './traceLogs/traceLogs.slice'
import { rootSaga } from './root.saga'

const rootReducer = combineReducers({
  traceLogs: traceLogsReducer,
  structLogs: structLogsReducer,
  sourceCodes: sourceCodesReducer,
  sighashes: sighashReducer,
  rawTxData: rawTxDataReducer,
  bytecodes: bytecodesReducer,
  analyzer: analyzerReducer,
  activeBlock: activeBlockReducer,
})

const sagaMiddleware = createSagaMiddleware()

// eslint-disable-next-line import/exports-last
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(sagaMiddleware),
})
sagaMiddleware.run(rootSaga)

export type TRootState = ReturnType<typeof store.getState>

export type TAppDispatch = typeof store.dispatch
