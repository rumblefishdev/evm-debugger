import { Box } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './router'

function App() {
  return (
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <RouterProvider router={router} />
    </Box>
  )
}

export default App
