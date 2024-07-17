import { styled, Typography, Link } from '@mui/material'
import type { LinkProps } from '@mui/material'

import { Button } from '../UiButton'

/* eslint sort-keys-fix/sort-keys-fix:0*/

export const StyledButton = styled(Button)({
  margin: '24px 0 6px !important',

  '.MuiStack-root': {
    padding: '16px',
    backgroundColor: 'transparent !important',
    border: '1px solid white',
    boxShadow: `0px 0px 6px 4px #6792F4, 0px 0px 6px 4px #6792F4 inset !important`,
  },
})

export const IssueTextContainer = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  width: '100%',
  textAlign: 'center',
  lineHeight: '150%',
  fontWeight: 400,
  fontStyle: 'normal',
  fontFamily: 'Satoshi',
  color: '#ABB1B4',
  letterSpacing: '-0,01em',
  fontSize: '14px',
}))

export const StyledBtnText = styled(Typography)(() => ({
  width: '100%',
  textAlign: 'center',
  lineHeight: '100%',
  fontWeight: 500,
  fontStyle: 'normal',
  fontFamily: 'Satoshi',
  letterSpacing: '-0,01em',
  fontSize: '20px',
}))

export const StyledLink = styled(Link)(() => ({
  lineHeight: '150%',
  fontWeight: 650,
  fontStyle: 'normal',
  fontFamily: 'Satoshi',
  fontSize: '14px',
  background: 'linear-gradient(152.46deg, #FFFFFF -22.85%, rgba(255, 255, 255, 0) 100%), #F47AFF',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontVariationSettings: 'slnt 0',
})) as React.FC<LinkProps>
