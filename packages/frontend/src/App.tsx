import { ThemeProvider } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import { theme } from './theme'
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
