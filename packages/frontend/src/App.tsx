import { ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

import { theme } from './theme/algaeTheme'
import { appRouter } from './router'
import { GAnalyticsInit } from './components/GAnalytics'

const emotionCache = createCache({
  speedy: false,
  key: 'emotion-cache',
})

type AppProps = {
  shouldUseCacheProvider: boolean
}

function App(props: AppProps) {
  GAnalyticsInit()

  if (!props.shouldUseCacheProvider)
    return (
      <ThemeProvider theme={theme}>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    )

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
