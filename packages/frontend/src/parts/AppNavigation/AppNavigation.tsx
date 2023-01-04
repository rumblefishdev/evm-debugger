import { Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { AppContainer } from '../../components/AppContainer'
import { ROUTES } from '../../router'

import type { AppNavigationProps } from './AppNavigation.types'
import { StyledTab, StyledTabs } from './styles'

export const AppNavigation = ({ ...props }: AppNavigationProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [value, setValue] = useState<ROUTES | string>(location.pathname)

  const handleChange = (event: React.SyntheticEvent, nextValue: ROUTES) => {
    setValue(nextValue)
  }

  const handleTabClick = (tabName: ROUTES) => {
    navigate(tabName)
  }

  return (
    <React.Fragment>
      <StyledTabs value={value} onChange={handleChange} centered>
        <StyledTab label="Data Manager" value={ROUTES.DATA_MANAGER} onClick={() => handleTabClick(ROUTES.DATA_MANAGER)} />
        <StyledTab label="Transaction screen" value={ROUTES.TRANSACTION_SCREEN} onClick={() => handleTabClick(ROUTES.TRANSACTION_SCREEN)} />
        <StyledTab
          label="Structlog Explorer"
          value={ROUTES.STRUCTLOGS_EXPLORER}
          onClick={() => handleTabClick(ROUTES.STRUCTLOGS_EXPLORER)}
        />
      </StyledTabs>
      <AppContainer withNavbar>
        <Outlet />
      </AppContainer>
    </React.Fragment>
  )
}
