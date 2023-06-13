import { ThemeProvider } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import { theme, themeDark, themeNavy } from './theme/algaeTheme'
import { appRouter } from './router'
import { GAnalyticsInit } from './components/GAnalytics'

function App() {
  GAnalyticsInit()
  return <RouterProvider router={appRouter} />
}

export default App
