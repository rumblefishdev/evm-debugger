import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { ROUTES } from '../../routes'
import { uiActions } from '../../store/ui/ui.slice'

import type { AppNavigationProps } from './AppNavigation.types'
import { StyledButtonWrapper, StyledNewTransactionButton, StyledShowLogsButton, StyledTab, StyledTabs } from './AppNavigation.styles'

export const AppNavigation: React.FC<AppNavigationProps> = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const { chainId, txHash } = useParams()
  const [value, setValue] = useState<ROUTES | string>(location.pathname)

  const convertNav = React.useCallback(
    (tabName: ROUTES): string => tabName.replace(':txHash', txHash).replace(':chainId', chainId),
    [chainId, txHash],
  )
  const handleTabClick = React.useCallback(
    (tabName: ROUTES) => {
      navigate(convertNav(tabName))
    },
    [convertNav, navigate],
  )

  // This way we handle changes in the URL by browser navigation
  React.useEffect(() => {
    setValue(location.pathname)
  }, [location.pathname])

  const showLogs = React.useCallback(() => {
    dispatch(uiActions.setShouldShowProgressScreen(true))
  }, [dispatch])

  return (
    <StyledButtonWrapper>
      <StyledNewTransactionButton />
      <StyledTabs
        value={value}
        centered
      >
        <StyledTab
          label="Data Manager"
          value={convertNav(ROUTES.DATA_MANAGER)}
          onClick={() => handleTabClick(ROUTES.DATA_MANAGER)}
        />
        <StyledTab
          label="Transaction screen"
          value={convertNav(ROUTES.TRANSACTION_SCREEN)}
          onClick={() => handleTabClick(ROUTES.TRANSACTION_SCREEN)}
        />
        <StyledTab
          label="Transaction Explorer"
          value={convertNav(ROUTES.TRANSACTION_EXPLORER)}
          onClick={() => handleTabClick(ROUTES.TRANSACTION_EXPLORER)}
        />
      </StyledTabs>
      <StyledShowLogsButton
        variant="text"
        size="small"
        onClick={showLogs}
      >
        Show logs
      </StyledShowLogsButton>
    </StyledButtonWrapper>
  )
}
