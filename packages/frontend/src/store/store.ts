import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import type { Storage } from 'redux-persist'
import indexedDbStorage from 'redux-persist-indexeddb-storage'

import { rootSaga } from './root.saga'
import SetTransform from './transformers'
import { rootReducer } from './root.reducer'

const getKey = (): string => {
  let key = 'manual'
  const pathname = window.location.pathname.match(/[^/]+/g)
  const regex = new RegExp(/^0x([\dA-Fa-f]{64})$/)

  if (!pathname) return key

  if (pathname.length >= 4 && pathname[0] === 'evm-debugger' && pathname[1] === 'tx' && regex.test(pathname[3]))
    key = `${pathname[2]}-${pathname[3]}`
  return key
}

const persistConfig = {
  transforms: [SetTransform],
  storage: indexedDbStorage('evmDebugger') as Storage,
  key: getKey(),
  blacklist: ['structLogsReducer'],
}

const sagaMiddleware = createSagaMiddleware()

const tempStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(sagaMiddleware),
})

const persistedReducer = persistReducer<ReturnType<typeof tempStore.getState>>(persistConfig, rootReducer)

// eslint-disable-next-line import/exports-last
export const isPersistOn = document.cookie.replace(/(?:(?:^|.*;\s*)store_persist\s*=\s*([^;]*).*$)|^.*$/, '$1') === 'true'

// eslint-disable-next-line import/exports-last
export const store = configureStore({
  reducer: isPersistOn ? persistedReducer : rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)
export const persistor = persistStore(store)

export type TRootState = ReturnType<typeof store.getState>

export type TAppDispatch = typeof store.dispatch
