import { ThemeProvider } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import { theme } from './theme'
import { appRouter } from './router'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  )
}

export default App
