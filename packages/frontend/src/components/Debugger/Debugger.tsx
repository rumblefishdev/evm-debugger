import React, { useState, useEffect } from 'react'

import { Supported } from '../Supported'
import { Manual } from '../Manual'

import { StyledTabs, StyledTab, DebuggerStack, ContentStack } from './styles'

export enum SCREENS {
  SUPPORTED_CHAIN = 'supportedChain',
  MANUAL_UPLOAD = 'manualUpload',
}

export const Debugger = () => {
  const [currentScreen, setCurrentScreen] = useState<SCREENS>(SCREENS.SUPPORTED_CHAIN)
  const handleChange = (_event: React.SyntheticEvent, nextValue: SCREENS) => {
    setCurrentScreen(nextValue)
  }
  const [isDebuggerFormVisible, setDebuggerFormVisible] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setDebuggerFormVisible(true)
    }, 1400)
  }, [])

  return (
    <DebuggerStack>
      {isDebuggerFormVisible && (
        <StyledTabs
          value={currentScreen}
          onChange={handleChange}
          centered
        >
          <StyledTab
            value={SCREENS.SUPPORTED_CHAIN}
            label="Supported Chain"
          />
          <StyledTab
            value={SCREENS.MANUAL_UPLOAD}
            label="Manual Upload"
          />
        </StyledTabs>
      )}

      <ContentStack>
        {currentScreen === SCREENS.SUPPORTED_CHAIN && <Supported />}
        {currentScreen === SCREENS.MANUAL_UPLOAD && <Manual />}
      </ContentStack>
    </DebuggerStack>
  )
}
