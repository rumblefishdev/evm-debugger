import { ThemeProvider, Stack } from '@mui/material'
import { RouterProvider } from 'react-router-dom'

import { theme } from './theme/algaeTheme'
import { appRouter } from './router'
import { GAnalyticsInit } from './components/GAnalytics'

function App() {
  GAnalyticsInit()
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  )
}

export default App
