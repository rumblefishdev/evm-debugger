import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { AppContainer } from '../../components/AppContainer'
import { ROUTES } from '../../router'
import { useTypedSelector } from '../../store/storeHooks'

import type { AppNavigationProps } from './AppNavigation.types'
import { StyledTab, StyledTabs } from './styles'

export const AppNavigation: React.FC<AppNavigationProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { chainId, txHash } = useParams()
  const [value, setValue] = useState<ROUTES | string>(location.pathname)
  const { stages } = useTypedSelector((state) => state.analyzer)
  const handleChange = (_event: React.SyntheticEvent, nextValue: ROUTES) => {
    setValue(nextValue)
  }

  const handleTabClick = (tabName: ROUTES) => {
    navigate(tabName.replace(':txHash', txHash).replace(':chainId', chainId))
  }

  return (
    <React.Fragment>
      {stages.every((stage) => stage.isFinished) && (
        <>
          <StyledTabs value={value} onChange={handleChange} centered>
            <StyledTab
              label="Data Manager"
              value={
                chainId && txHash
                  ? ROUTES.DATA_MANAGER
                  : ROUTES.DATA_MANAGER_MANUAL
              }
              onClick={() =>
                handleTabClick(
                  chainId && txHash
                    ? ROUTES.DATA_MANAGER
                    : ROUTES.DATA_MANAGER_MANUAL,
                )
              }
            />
            <StyledTab
              label="Transaction screen"
              value={
                chainId && txHash
                  ? ROUTES.TRANSACTION_SCREEN
                  : ROUTES.TRANSACTION_SCREEN_MANUAL
              }
              onClick={() =>
                handleTabClick(
                  chainId && txHash
                    ? ROUTES.TRANSACTION_SCREEN
                    : ROUTES.TRANSACTION_SCREEN_MANUAL,
                )
              }
            />
            <StyledTab
              label="Structlog Explorer"
              value={
                chainId && txHash
                  ? ROUTES.STRUCTLOGS_EXPLORER
                  : ROUTES.STRUCTLOGS_EXPLORER_MANUAL
              }
              onClick={() =>
                handleTabClick(
                  chainId && txHash
                    ? ROUTES.STRUCTLOGS_EXPLORER
                    : ROUTES.STRUCTLOGS_EXPLORER_MANUAL,
                )
              }
            />
          </StyledTabs>
        </>
      )}
      <AppContainer withNavbar>
        <Outlet />
      </AppContainer>
    </React.Fragment>
  )
}
