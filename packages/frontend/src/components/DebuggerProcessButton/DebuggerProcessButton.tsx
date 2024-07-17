/* eslint sort-keys-fix/sort-keys-fix:0*/ // eslint reorders css styles, causing it to not work properly. So this rule is off.
import React from 'react'

import { reportIssuePageUrl } from '../../config'

import type { ButtonProps } from './DebuggerProcessButton.types'
import { IssueTextContainer, StyledLink, StyledBtnText, StyledButton } from './styles'

export const DebuggerProcessButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <>
      <StyledButton
        sx={{ width: '100%', marginTop: '20px', borderRadius: '16px' }}
        size="large"
        onClick={onClick}
        fullWidth
        fontColor='white'
      >
        <StyledBtnText>Process logs</StyledBtnText>
      </StyledButton>
      <IssueTextContainer>
        Found a bug? &nbsp;
        <StyledLink
          variant={'caption'}
          href={reportIssuePageUrl}
          sx={{
            position: 'relative',
            textDecoration: 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: -2,
              width: '100%',
              height: '1px',
              background: 'linear-gradient(152.46deg, #FFFFFF -22.85%, rgba(255, 255, 255, 0) 100%), #F47AFF',
            },
          }}
        >
          Click to raise an issue.
        </StyledLink>
      </IssueTextContainer>
    </>
  )
}
