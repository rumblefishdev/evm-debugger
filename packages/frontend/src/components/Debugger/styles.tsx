import { Tabs, Tab, Stack, styled, Typography, Link } from '@mui/material'
import type { LinkProps } from '@mui/material'

/* eslint sort-keys-fix/sort-keys-fix:0*/
export const DebuggerStack = styled(Stack)(({ theme }) => ({
  zIndex: 4,
  padding: theme.spacing(6),
  borderRadius: '24px',
  background:
    'radial-gradient(102.78% 104.72% at -0.77% 0%, rgba(255, 255, 255, 0.075) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.01)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '40%',
  gap: theme.spacing(4),
  [theme.breakpoints.down('lg')]: {
    width: '50%',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(5),
    gap: theme.spacing(2),
    width: '75%',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    width: '100%',
  },
}))

export const StyledTabs = styled(Tabs)(() => ({
  width: '100%',
  minHeight: '48px',

  '& .MuiTabs-indicator': {
    height: '1px',
    backgroundColor: 'white',
  },
  '& .MuiButtonBase-root': {},
}))

export const StyledTab = styled(Tab)(() => ({
  textTransform: 'none',
  lineHeight: '100%',
  fontWeight: 600,
  fontStyle: 'normal',
  fontFamily: 'Rajdhani',
  color: 'white',
  opacity: 0.5,
  letterSpacing: '-0,01em',
  fontSize: '15px',
  width: '50%',
  borderBox: 'border-box',
  borderBottom: `1px solid rgba(193, 199, 205, 0.15)`,
  '&.Mui-selected': {
    color: 'white',
    opacity: 1,
  },
}))

export const ContentStack = styled(Stack)(() => ({
  width: '100%',
  alignItems: 'center',
  height: 'auto',
}))

export const IssueTextContainer = styled(Typography)(() => ({
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
