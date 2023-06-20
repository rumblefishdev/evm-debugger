import { ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

import { theme } from './theme/algaeTheme'
import { appRouter } from './router'
import { GAnalyticsInit } from './components/GAnalytics'

const isPrerender = navigator.userAgent.toLowerCase().indexOf('prerender') === -1

const emotionCache = createCache({
  speedy: false,
  key: 'emotion-cache',
})

function App() {
  GAnalyticsInit()
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
