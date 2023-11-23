import { RouterProvider } from 'react-router-dom'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { appRouter } from './router'
import { GAnalyticsInit } from './components/GAnalytics'

const emotionCache = createCache({
  speedy: false,
  key: 'emotion-cache',
})

type AppProps = {
  shouldUseCacheProvider: boolean
}
const AddBodyScript = () => {
  return (
    <Helmet>
      <body>
        {`        <noscript>
          <iframe
            title="gtm"
            src={"https://www.googletagmanager.com/ns.html?id=${process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID}"}
            height="0"
            width="0"
            style={{ visibility: 'hidden', display: 'none' }}
          />
        </noscript>`}
      </body>
    </Helmet>
  )
}

function App(props: AppProps) {
  useEffect(() => {
    GAnalyticsInit()
  }, [])

  if (!props.shouldUseCacheProvider)
    return (
      <>
        <AddBodyScript />
        <RouterProvider router={appRouter} />
      </>
    )

  return (
    <>
      <AddBodyScript />
      <CacheProvider value={emotionCache}>
        <RouterProvider router={appRouter} />
      </CacheProvider>
    </>
  )
}

export default App
