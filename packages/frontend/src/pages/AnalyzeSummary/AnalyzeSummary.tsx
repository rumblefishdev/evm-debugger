import React, { useState } from 'react'
import { Button } from '@mui/material'

import { BytecodesManager, SighashesManager } from '../../components/Managers'
import { Navigation } from '../../components/Navigation'
import { useTypedSelector } from '../../store/storeHooks'

import type { AnalyzeSummaryProps, TTabType } from './AnalyzeSummary.types'
import { StyledButtonsWrapper, StyledContentWrapper } from './styles'

export const AnalyzeSummary: React.FC<AnalyzeSummaryProps> = () => {
  const isLoading = useTypedSelector((state) => state.analyzer.isLoading)
  const [activeTab, setActiveTab] = useState<TTabType>('bytecodes')

  const handleTabChange = (tabName: TTabType) => {
    setActiveTab(tabName)
  }

  const renderTab = () => {
    switch (activeTab) {
      // TODO: https://github.com/rumblefishdev/evm-debuger/issues/103
      // case 'sourcecodes': {
      //   return <SourcecodesManager />
      // }
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

  // TODO: https://github.com/rumblefishdev/evm-debuger/issues/87

  return isLoading ? null : (
    <>
      <Navigation />
      <StyledButtonsWrapper>
        {/* <Button variant="contained" color="primary" sx={{ margin: '0 12px' }} onClick={() => handleTabChange('sourcecodes')}>
          Source Codes
        </Button> */}
        <Button
          variant="contained"
          color="primary"
          sx={{ margin: '0 12px' }}
          onClick={() => handleTabChange('bytecodes')}
        >
          Bytecodes
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ margin: '0 12px' }}
          onClick={() => handleTabChange('sighashes')}
        >
          Abis
        </Button>
      </StyledButtonsWrapper>
      <StyledContentWrapper>{renderTab()}</StyledContentWrapper>
    </>
  )
}
