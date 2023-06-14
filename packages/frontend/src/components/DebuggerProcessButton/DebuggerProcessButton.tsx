import React from 'react'

import { reportIssuePageUrl } from '../../config'
import { Button } from '../../importedComponents/components/Button'

import type { ButtonProps } from './DebuggerProcessButton.types'
import { IssueTextContainer, StyledLink, StyledBtnText } from './styles'

export const DebuggerProcessButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <>
      <Button
        sx={{ width: '100%', marginTop: '40px', borderRadius: '16px' }}
        size="large"
        variant="contained"
        onClick={onClick}
      >
        <StyledBtnText>Process logs</StyledBtnText>
      </Button>
      <IssueTextContainer>
        Found a bug? &nbsp;
        <StyledLink
          variant={'caption'}
          href={reportIssuePageUrl}
          /* eslint-disable */
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
              background:
                'linear-gradient(152.46deg, #FFFFFF -22.85%, rgba(255, 255, 255, 0) 100%), #F47AFF',
            },
          }}
          /* eslint-enable */
        >
          Click to raise an issue.
        </StyledLink>
      </IssueTextContainer>
    </>
  )
}
