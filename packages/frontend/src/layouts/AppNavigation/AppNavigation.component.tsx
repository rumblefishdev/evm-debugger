import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Box, useMediaQuery } from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'

import { ROUTES } from '../../routes'
import { uiActions } from '../../store/ui/ui.slice'
import { Button } from '../../components/Button'

import type { AppNavigationProps } from './AppNavigation.types'
import { StyledButtonWrapper, StyledNewTransactionButton, StyledTab, StyledTabs } from './AppNavigation.styles'

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

  const isHeaderBreakPoint = useMediaQuery('(max-width:740px)')
  const shouldRenderVerticalTabs = useMediaQuery('(max-width:500px)')

  return (
    <StyledButtonWrapper
      sx={{
        justifyContent: isHeaderBreakPoint ? 'center' : 'space-between',
        flexDirection: isHeaderBreakPoint ? 'column' : 'row',
        alignItems: isHeaderBreakPoint ? 'flex-start' : 'center',
      }}
    >
      <StyledNewTransactionButton />

      <Box sx={{ order: isHeaderBreakPoint ? 2 : 1, marginTop: shouldRenderVerticalTabs ? 1 : 0 }}>
        <StyledTabs
          value={value}
          centered={!isHeaderBreakPoint}
          TabIndicatorProps={{
            sx: { display: shouldRenderVerticalTabs ? 'none' : 'block' },
          }}
          sx={{
            '& .MuiTabs-scroller .MuiTabs-flexContainer': {
              display: isHeaderBreakPoint ? 'block' : 'flex',
            },
            '& .MuiTabs-flexContainer .MuiButtonBase-root ': {
              margin: isHeaderBreakPoint ? 0 : 0.5,
              display: shouldRenderVerticalTabs ? 'block' : 'inline-flex',
            },
          }}
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
      </Box>

      <Box order={isHeaderBreakPoint ? 1 : 2}>
        <Button
          variant="text"
          size="small"
          onClick={showLogs}
          sx={{
            whiteSpace: 'nowrap',
          }}
          startIcon={<DescriptionIcon />}
        >
          Show logs
        </Button>
      </Box>
    </StyledButtonWrapper>
  )
}
