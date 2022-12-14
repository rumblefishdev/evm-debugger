import React, { useState } from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { useAnalyzer } from '../../hooks/useAnalyzer'
import { BytecodesManager, SighashesManager, SourcecodesManager } from '../../components/Managers'

import type { AnalyzeSummaryProps, TTabType } from './AnalyzeSummary.types'
import { StyledButtonsWrapper, StyledContentWrapper, StyledStack, StyledWrapper } from './styles'

export const AnalyzeSummary = ({ ...props }: AnalyzeSummaryProps) => {
  const { isLoading } = useAnalyzer()

  const [activeTab, setActiveTab] = useState<TTabType>('sourcecodes')

  const navigate = useNavigate()

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
      <StyledWrapper>
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
        <Button variant="contained" sx={{ marginTop: '12px' }} onClick={() => navigate('/mainDisplay')}>
          Proceed
        </Button>
      </StyledWrapper>
    </StyledStack>
  )
}
