import React, { useState } from 'react'
import { Button } from '@mui/material'

import { useAnalyzer } from '../../hooks/useAnalyzer'
import { BytecodesManager, SighashesManager, SourcecodesManager } from '../../components/Managers'
import { Navigation } from '../../components/Navigation'

import type { AnalyzeSummaryProps, TTabType } from './AnalyzeSummary.types'
import { StyledButtonsWrapper, StyledContentWrapper, StyledStack } from './styles'

export const AnalyzeSummary = ({ ...props }: AnalyzeSummaryProps) => {
  const { isLoading } = useAnalyzer()

  const [activeTab, setActiveTab] = useState<TTabType>('sourcecodes')

  const handleTabChange = (tabName: TTabType) => {
    setActiveTab(tabName)
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'sourcecodes': {
        return <SourcecodesManager />
      }
      case 'bytecodes': {
        return <BytecodesManager />
      }
      case 'sighashes': {
        return <SighashesManager />
      }
      default: {
        return null
      }
    }
  }

  return isLoading ? null : (
    <StyledStack {...props}>
      <Navigation />
      <StyledButtonsWrapper>
        <Button variant="contained" color="primary" sx={{ margin: '0 12px' }} onClick={() => handleTabChange('sourcecodes')}>
          Source Codes
        </Button>
        <Button variant="contained" color="primary" sx={{ margin: '0 12px' }} onClick={() => handleTabChange('bytecodes')}>
          Bytecodes
        </Button>
        <Button variant="contained" color="primary" sx={{ margin: '0 12px' }} onClick={() => handleTabChange('sighashes')}>
          Abis
        </Button>
      </StyledButtonsWrapper>
      <StyledContentWrapper>{renderTab()}</StyledContentWrapper>
    </StyledStack>
  )
}
