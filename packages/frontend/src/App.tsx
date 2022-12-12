import { Box } from '@mui/material'
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { MainDisplay } from './pages/MainDisplay'
import { SelectTransactionScreen } from './pages/SelectTransactionScreen'

const router = createBrowserRouter([
  {
    path: '/',
    element: <SelectTransactionScreen />,
  },
  {
    path: '/mainDisplay',
    element: <MainDisplay />,
  },
  {
    path: '/summary',
    element: <AnalyzeSummary />,
  },
])

function App() {
  return (
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <RouterProvider router={router} />
    </Box>
  )
}

export default App
