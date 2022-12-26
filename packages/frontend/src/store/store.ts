import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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

const persistConfig = {
  storage,
  key: 'root',
  blacklist: [
    'analyzer',
    'activeBlock',
    'structLogs',
    'rawTxData',
    'activeBlock',
    'traceLogs',
    'bytecodes',
    'sourceCodes',
    'sighashes',
  ],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(sagaMiddleware),
})

export const persistor = persistStore(store, null, () =>
  sagaMiddleware.run(rootSaga),
)

export type TRootState = ReturnType<typeof store.getState>

export type TAppDispatch = typeof store.dispatch
