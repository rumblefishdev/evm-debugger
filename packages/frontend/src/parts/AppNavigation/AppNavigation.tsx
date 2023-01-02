import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { ROUTES } from '../../router'

import type { AppNavigationProps } from './AppNavigation.types'

export const AppNavigation = ({ ...props }: AppNavigationProps) => {
  const navigate = useNavigate()

  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, nextValue: number) => {
    setValue(nextValue)
  }

  const handleTabClick = (tabName: ROUTES) => {
    navigate(tabName)
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Item One" onClick={() => handleTabClick(ROUTES.DATA_MANAGER)} />
        <Tab label="Item Two" onClick={() => handleTabClick(ROUTES.TRANSACTION_SCREEN)} />
        <Tab label="Item Three" onClick={() => handleTabClick(ROUTES.STRUCTLOGS_EXPLORER)} />
      </Tabs>
      <Outlet />
    </Box>
  )
}
