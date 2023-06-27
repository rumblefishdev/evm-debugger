import { styled, Typography, Link } from '@mui/material'
import type { LinkProps } from '@mui/material'

/* eslint sort-keys-fix/sort-keys-fix:0*/

export const IssueTextContainer = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  width: '100%',
  textAlign: 'center',
  lineHeight: '150%',
  fontWeight: 350,
  fontStyle: 'normal',
  fontFamily: 'Inter',
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
  fontFamily: 'Rajdhani',
  color: '#1C1F22',
  letterSpacing: '-0,01em',
  fontSize: '20px',
}))

export const StyledLink = styled(Link)(() => ({
  lineHeight: '150%',
  fontWeight: 650,
  fontStyle: 'normal',
  fontFamily: 'Inter',
  fontSize: '14px',
  background: 'linear-gradient(152.46deg, #FFFFFF -22.85%, rgba(255, 255, 255, 0) 100%), #F47AFF',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontVariationSettings: 'slnt 0',
})) as React.FC<LinkProps>
