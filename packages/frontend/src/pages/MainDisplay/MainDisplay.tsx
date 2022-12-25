import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { BlockSummary } from '../../components/BlockSummary'
import { ContentMap } from '../../components/ContentMap'
import { Navigation } from '../../components/Navigation'
import { typedNavigate } from '../../router'
import { useTypedSelector } from '../../store/storeHooks'

import type { MainDisplayProps } from './MainDisplay.types'
import { StyledContentWrapper, StyledMainDisplay } from './styles'

export const MainDisplay = ({ ...props }: MainDisplayProps) => {
  const traceLog = useTypedSelector((state) => state.traceLogs)
  const navigate = useNavigate()
  useEffect(() => {
    if (traceLog.length === 0) typedNavigate(navigate, '/')
  }, [traceLog, navigate])

  if (traceLog.length === 0) return null

  return (
    <StyledMainDisplay {...props}>
      <Navigation sx={{ alignSelf: 'center' }} />
      <StyledContentWrapper>
        <ContentMap />
        <BlockSummary />
      </StyledContentWrapper>
    </StyledMainDisplay>
  )
}
