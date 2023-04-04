import React, { useState } from 'react'

import type { TTabType } from './AnalyzeSummary.types'
import {
  BytecodesManager,
  SighashesManager,
  SourcecodesManager,
} from './Managers'
import {
  StyledContentWrapper,
  StyledStack,
  StyledTab,
  StyledTabs,
} from './styles'

export const AnalyzeSummary = () => {
  const [activeTab, setActiveTab] = useState<TTabType>('bytecodes')

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

  return (
    <StyledStack>
      <StyledTabs value={activeTab}>
        <StyledTab
          disableRipple
          label="Source Codes"
          value={'sourcecodes'}
          onClick={() => handleTabChange('sourcecodes')}
        />
        <StyledTab
          disableRipple
          label="Bytecodes"
          value={'bytecodes'}
          onClick={() => handleTabChange('bytecodes')}
        />
        <StyledTab
          disableRipple
          label="Abis"
          value={'sighashes'}
          onClick={() => handleTabChange('sighashes')}
        />
      </StyledTabs>
      <StyledContentWrapper>{renderTab()}</StyledContentWrapper>
    </StyledStack>
  )
}
