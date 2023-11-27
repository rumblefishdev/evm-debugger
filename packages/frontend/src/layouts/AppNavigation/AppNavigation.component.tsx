import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '../../routes'

import type { AppNavigationProps } from './AppNavigation.types'
import { StyledButtonWrapper, StyledNewTransactionButton, StyledTab, StyledTabs } from './AppNavigation.styles'

export const AppNavigation: React.FC<AppNavigationProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { chainId, txHash } = useParams()
  const [value, setValue] = useState<ROUTES | string>(location.pathname)

  const handleChange = React.useCallback((_event: React.SyntheticEvent, nextValue: ROUTES) => {
    setValue(nextValue)
  }, [])

  const convertNav = React.useCallback(
    (tabName: ROUTES): string => tabName.replace(':txHash', txHash).replace(':chainId', chainId),
    [chainId, txHash],
  )
  const handleTabClick = React.useCallback((tabName: ROUTES) => navigate(convertNav(tabName)), [convertNav, navigate])

  return (
    <StyledButtonWrapper>
      <StyledNewTransactionButton />
      <StyledTabs
        value={value}
        onChange={handleChange}
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
    </StyledButtonWrapper>
  )
}
