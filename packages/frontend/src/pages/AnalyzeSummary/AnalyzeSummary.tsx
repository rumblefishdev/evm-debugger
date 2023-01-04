import React, { useState } from 'react'

import { BytecodesManager, SighashesManager, SourcecodesManager } from '../../parts/Managers'

import type { AnalyzeSummaryProps, TTabType } from './AnalyzeSummary.types'
import { StyledContentWrapper, StyledStack, StyledTab, StyledTabs } from './styles'

export const AnalyzeSummary: React.FC<AnalyzeSummaryProps> = () => {
  const [activeTab, setActiveTab] = useState<TTabType>('bytecodes')

  const handleTabChange = (tabName: TTabType) => {
    setActiveTab(tabName)
  }

  const renderTab = () => {
    switch (activeTab) {
      // TODO: https://github.com/rumblefishdev/evm-debuger/issues/103
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

  return (
    <StyledStack>
      <StyledTabs value={activeTab}>
        <StyledTab disableRipple disabled label="Source Codes" value={'sourcecodes'} onClick={() => handleTabChange('sourcecodes')} />
        <StyledTab disableRipple label="Bytecodes" value={'bytecodes'} onClick={() => handleTabChange('bytecodes')} />
        <StyledTab disableRipple label="Abis" value={'sighashes'} onClick={() => handleTabChange('sighashes')} />
      </StyledTabs>
      <StyledContentWrapper>{renderTab()}</StyledContentWrapper>
    </StyledStack>
  )
}
