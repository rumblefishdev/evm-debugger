import React, { useState } from 'react'

import { Button } from '../Button'
// import { DebuggerSupportedChain } from '../DebuggerSupportedChain'

import { reportIssuePageUrl } from './config'
import { StyledTabs, StyledTab, DebuggerStack, IssueTextContainer, StyledLink, ContentStack, StyledBtnText } from './styles'

export enum SCREENS {
  SUPPORTED_CHAIN = 'supportedChain',
  MANUAL_UPLOAD = 'manualUpload',
}

export const Debugger = React.forwardRef(function Ref() {
  const [currentScreen, setCurrentScreen] = useState<SCREENS>(SCREENS.SUPPORTED_CHAIN)
  const handleChange = (_event: React.SyntheticEvent, nextValue: SCREENS) => {
    setCurrentScreen(nextValue)
  }

  return (
    <DebuggerStack>
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

      <ContentStack>
        {/* {currentScreen === SCREENS.SUPPORTED_CHAIN && <DebuggerSupportedChain />} */}
        {/* {currentScreen === SCREENS.MANUAL_UPLOAD && (<DebuggerManualUpload />)} */}
      </ContentStack>

      <Button
        sx={{ width: '100%', borderRadius: '16px' }}
        big={true}
        variant="contained"
        onClick={() => console.log('click')}
      >
        <StyledBtnText>Process logs</StyledBtnText>
      </Button>

      <IssueTextContainer>
        Found a bug? &nbsp;
        <StyledLink
          variant={'caption'}
          href={reportIssuePageUrl}
          sx={{
            textDecoration: 'none',
            position: 'relative',
            '&::after': {
              width: '100%',
              position: 'absolute',
              left: 0,
              height: '1px',
              content: '""',
              bottom: -2,
              background: 'linear-gradient(152.46deg, #FFFFFF -22.85%, rgba(255, 255, 255, 0) 100%), #F47AFF',
            },
          }}
        >
          Click to raise an issue.
        </StyledLink>
      </IssueTextContainer>
    </DebuggerStack>
  )
})
