import { Stack, ThemeProvider } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import { theme } from './theme'
import { appRouter } from './router'

function App() {
  return (
    <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
      <Stack
        sx={{
          width: '100%',
          overflow: 'hidden',
          maxWidth: '1600px',
          justifyContent: 'center',
          height: '100vh',
          alignItems: 'center',
        }}
      >
        <ThemeProvider theme={theme}>
          <RouterProvider router={appRouter} />
        </ThemeProvider>
      </Stack>
    </Stack>
  )
}

export default App
