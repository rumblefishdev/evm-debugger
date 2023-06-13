import { Tabs, Tab, Stack, styled, Typography, Link } from '@mui/material'
import type { LinkProps } from '@mui/material'

export const DebuggerStack = styled(Stack)(({ theme }) => ({
  zIndex: 4,
  width: '40%',
  padding: theme.spacing(6),
  justifyContent: 'center',
  gap: theme.spacing(4),
  flexDirection: 'column',
  display: 'flex',
  borderRadius: '24px',
  background:
    'radial-gradient(102.78% 104.72% at -0.77% 0%, rgba(255, 255, 255, 0.075) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.01)',
  alignItems: 'center',
  [theme.breakpoints.down('lg')]: {
    width: '50%',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',
  minHeight: '48px',

  '& .MuiTabs-indicator': {
    height: '1px',
    backgroundColor: 'white',
  },
}))

export const StyledTab = styled(Tab)(({ theme }) => ({
  width: '50%',
  textTransform: 'none',
  opacity: 0.5,
  lineHeight: '100%',
  letterSpacing: '-0,01em',
  fontWeight: 600,
  fontStyle: 'normal',
  fontSize: '15px',
  fontFamily: 'Rajdhani',
  color: 'white',
  borderBox: 'border-box',
  borderBottom: `1px solid rgba(193, 199, 205, 0.15)`,
  '&.Mui-selected': {
    opacity: 1,
    color: 'white',
  },
}))

export const ContentStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '160px',
  alignItems: 'center',
}))

export const IssueTextContainer = styled(Typography)(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  lineHeight: '150%',
  letterSpacing: '-0,01em',
  fontWeight: 350,
  fontStyle: 'normal',
  fontSize: '14px',
  fontFamily: 'Inter',
  color: '#ABB1B4',
}))

export const StyledBtnText = styled(Typography)(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  lineHeight: '100%',
  letterSpacing: '-0,01em',
  fontWeight: 500,
  fontStyle: 'normal',
  fontSize: '20px',
  fontFamily: 'Rajdhani',
  color: '#1C1F22',
}))

export const StyledLink = styled(Link)(({ theme }) => ({
  WebkitTextFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  lineHeight: '150%',
  fontWeight: 650,
  fontVariationSettings: 'slnt 0',
  fontStyle: 'normal',
  fontSize: '14px',
  fontFamily: 'Inter',
  backgroundClip: 'text',
  background: 'linear-gradient(152.46deg, #FFFFFF -22.85%, rgba(255, 255, 255, 0) 100%), #F47AFF',
})) as React.FC<LinkProps>
