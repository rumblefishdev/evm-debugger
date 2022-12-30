import { Stack } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './router'

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
      <RouterProvider router={router} />
    </Stack>
  )
}

export default App
