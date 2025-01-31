import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './fonts'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import * as Sentry from '@sentry/react'
import './polyfills'

import App from './App'
import reportWebVitals from './reportWebVitals'
import { isPersistOn, persistor, store } from './store/store'
import { environment, sentryDsn, version } from './config'

if (sentryDsn)
  Sentry.init({
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    release: version,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    environment,
    dsn: sentryDsn,
  })

const rootElement = document.getElementById('root')

const RenderApp = (props: { isHydrated?: boolean }) => {
  const shouldUseCacheProvider = process.env.REACT_APP_IS_PRERENDER === 'true' || Boolean(props.isHydrated)

  return (
    <div>
      <React.StrictMode>
        <Provider store={store}>
          {isPersistOn && (
            <PersistGate
              loading={true}
              persistor={persistor}
            >
              <App shouldUseCacheProvider={shouldUseCacheProvider} />
            </PersistGate>
          )}
          {!isPersistOn && <App shouldUseCacheProvider={shouldUseCacheProvider} />}
        </Provider>
      </React.StrictMode>
    </div>
  )
}

const root = createRoot(rootElement)

if (rootElement.hasChildNodes()) hydrateRoot(rootElement, <RenderApp isHydrated />)
else root.render(<RenderApp />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

// @ts-expect-error this isn't typed correctly
if (module.hot) module.hot.accept()
