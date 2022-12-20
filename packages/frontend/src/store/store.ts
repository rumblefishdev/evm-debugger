import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { activeBlockReducer } from './activeBlock/activeBlock.slice'
import { activeStructlogReducer } from './activeStructlog/activeStructlog.slice'
import { bytecodesReducer } from './bytecodes/bytecodes.slice'
import { rawTxDataReducer } from './rawTxData/rawTxData.slice'
import { sighashReducer } from './sighash/sighash.slice'
import { sourceCodesReducer } from './sourceCodes/sourceCodes.slice'
import { traceLogsReducer } from './traceLogs/traceLogs.slice'

const rootReducer = combineReducers({
  traceLogs: traceLogsReducer,
  sourceCodes: sourceCodesReducer,
  sighashes: sighashReducer,
  rawTxData: rawTxDataReducer,
  bytecodes: bytecodesReducer,
  activeStructlog: activeStructlogReducer,
  activeBlock: activeBlockReducer,
})

const persistConfig = {
  storage,
  key: 'root',
  blacklist: ['activeBlock', 'structLogs', 'rawTxData', 'activeStructlog', 'activeBlock', 'traceLogs'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type TRootState = ReturnType<typeof store.getState>

export type TAppDispatch = typeof store.dispatch
