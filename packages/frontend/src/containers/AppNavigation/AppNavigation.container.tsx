import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Drawer } from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'

import type { ROUTES } from '../../routes'
import { uiActions } from '../../store/ui/ui.slice'
import { uiSelectors } from '../../store/ui/ui.selectors'
import { FunctionStackTrace } from '../FunctionStackTrace/FunctionStackTrace.container'

import { AppNavigationComponent } from './AppNavigation.component'

export const AppNavigation: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const isFunctionStackTraceVisible = useSelector(uiSelectors.selectShouldShowFunctionStackTrace)

  const { chainId, txHash } = useParams()
  const [value, setValue] = React.useState<ROUTES | string>(location.pathname)

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

  const toggleFunctionStackTrace = React.useCallback(() => {
    dispatch(uiActions.setShouldShowFunctionStackTrace(!isFunctionStackTraceVisible))
  }, [dispatch, isFunctionStackTraceVisible])

  return (
    <React.Fragment>
      <AppNavigationComponent
        convertNavigationTabName={convertNav}
        handleTabChange={handleTabClick}
        activeTabName={value}
        showAnalyzerLogs={showLogs}
        toggleFunctionStackTrace={toggleFunctionStackTrace}
        isFunctionStackTraceVisible={isFunctionStackTraceVisible}
      />
      <Drawer
        anchor="top"
        disablePortal
        open={isFunctionStackTraceVisible}
        onClose={toggleFunctionStackTrace}
      >
        <FunctionStackTrace />
      </Drawer>
    </React.Fragment>
  )
}
