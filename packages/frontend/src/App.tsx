import { Stack, ThemeProvider } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './router'
import { theme } from './theme'

function App() {
  return (
    <Stack
      sx={{
        width: '100vw',
        padding: '12px 24px',
        overflow: 'hidden',
        height: '100vh',
        alignItems: 'center',
      }}
    >
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Stack>
  )
}

export default App
