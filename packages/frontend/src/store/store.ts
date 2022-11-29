import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { activeBlockReducer } from './activeBlock/activeBlock.slice'
import { rawTxDataReducer } from './rawTxData/rawTxData.slice'
import { traceLogsReducer } from './traceLogs/traceLogs.slice'

const rootReducer = combineReducers({
    traceLogs: traceLogsReducer,
    rawTxData: rawTxDataReducer,
    activeBlock: activeBlockReducer,
})

const persistConfig = {
    storage,
    key: 'root',
    blacklist: ['activeBlock', 'structLogs', 'rawTxData'],
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
