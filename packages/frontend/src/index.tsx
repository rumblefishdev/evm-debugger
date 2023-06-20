import React from 'react'
import ReactDOM from 'react-dom'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import './fonts'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import * as Sentry from '@sentry/react'

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

// const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement)
const rootElement = document.getElementById('root')

const RenderApp = () => {
  return (
    <div>
      <React.StrictMode>
        <Provider store={store}>
          {isPersistOn && (
            <PersistGate
              loading={true}
              persistor={persistor}
            >
              <App />
            </PersistGate>
          )}
          {!isPersistOn && <App />}
        </Provider>
      </React.StrictMode>
    </div>
  )
}

if (rootElement.hasChildNodes())
  setTimeout(() => {
    hydrateRoot(rootElement, <RenderApp />)
  }, 3000)
else ReactDOM.render(<RenderApp />, rootElement)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

// @ts-expect-error this isn't typed correctly
if (module.hot) module.hot.accept()
