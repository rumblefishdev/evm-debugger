import { Stack, ThemeProvider } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './router'
import { theme } from './theme'

function App() {
  return (
    <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
      <Stack
        sx={{
          width: '100%',
          padding: '12px 24px',
          overflow: 'hidden',
          maxWidth: '1600px',
          justifyContent: 'center',
          height: '100vh',
          alignItems: 'center',
        }}
      >
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Stack>
    </Stack>
  )
}

export default App
