import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import type { Storage } from 'redux-persist'
import indexedDbStorage from 'redux-persist-indexeddb-storage'

import { activeBlockReducer } from './activeBlock/activeBlock.slice'
import { structLogsReducer } from './structlogs/structlogs.slice'
import { bytecodesReducer } from './bytecodes/bytecodes.slice'
import { analyzerReducer } from './analyzer/analyzer.slice'
import { rawTxDataReducer } from './rawTxData/rawTxData.slice'
import { sighashReducer } from './sighash/sighash.slice'
import { sourceCodesReducer } from './sourceCodes/sourceCodes.slice'
import { traceLogsReducer } from './traceLogs/traceLogs.slice'
import { rootSaga } from './root.saga'
import { contractNamesReducer } from './contractNames/contractNames'
import SetTransform from './transformers'

const getKey = (): string => {
  let key = 'manual'
  const pathname = window.location.pathname.match(/[^/]+/g)
  const regex = new RegExp(/^0x([\dA-Fa-f]{64})$/)
  if (
    pathname.length >= 4 &&
    pathname[0] === 'evmDebugger' &&
    pathname[1] === 'tx' &&
    regex.test(pathname[3])
  )
    key = `${pathname[2]}-${pathname[3]}`
  return key
}

const persistConfig = {
  transforms: [SetTransform],
  storage: indexedDbStorage('evmDebugger') as Storage,
  key: getKey(),
  blacklist: [],
}

const rootReducer = combineReducers({
  traceLogs: traceLogsReducer,
  structLogs: structLogsReducer,
  sourceCodes: sourceCodesReducer,
  sighashes: sighashReducer,
  rawTxData: rawTxDataReducer,
  contractNames: contractNamesReducer,
  bytecodes: bytecodesReducer,
  analyzer: analyzerReducer,
  activeBlock: activeBlockReducer,
})

const sagaMiddleware = createSagaMiddleware()

const tempStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(sagaMiddleware),
})

const persistedReducer = persistReducer<ReturnType<typeof tempStore.getState>>(
  persistConfig,
  rootReducer,
)

// eslint-disable-next-line import/exports-last
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)
export const persistor = persistStore(store)

export type TRootState = ReturnType<typeof store.getState>

export type TAppDispatch = typeof store.dispatch
