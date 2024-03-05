import { Stack, Typography, styled } from '@mui/material'

export const StyledBar = styled(Stack)(({ theme }) => ({
  zIndex: 10,
  width: '100%',
  transition: 'all 0.3s ease',
  position: 'fixed',
  padding: theme.spacing(2),
  left: 0,
  justifyContent: 'center',
  height: 32,
  cursor: 'pointer',
  boxSizing: 'border-box',
  bottom: 0,

  borderTop: `1px solid #eeeeee`,

  backgroundColor: theme.palette.rfWhite,
  alignItems: 'center',

  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}))

export const StyledBarText = styled(Typography)(({ theme }) => ({
  ...theme.typography.buttonBig,
  color: theme.palette.rfButton,
}))

export const TraceLogElement = styled('div')(({ theme }) => ({
  minHeight: theme.spacing(4),
  height: theme.spacing(4),
  display: 'flex',
  cursor: 'pointer',
}))

export const Indent = styled('div')(({ theme }) => ({
  width: '1rem',
  minWidth: '1rem',
  borderLeft: `1px solid ${theme.palette.rfLinesLight}`,
}))

export const OpWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  ':before': {
    width: theme.spacing(3),
    margin: `0 ${theme.spacing(1)} 0 -${theme.spacing(4)}`,
    display: 'block',
    content: '""',
    borderBottom: `1px solid ${theme.palette.rfLinesLight}`,
  },
  ...(isActive && { color: theme.palette.rfButton }),
}))

export const StyledFailureIcon = styled('span')(({ theme }) => ({
  paddingRight: theme.spacing(2),
}))

export const StyledSmallPanel = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  boxSizing: 'border-box',
  boxShadow: '0px 0px 8px 0px rgba(0, 10, 108, 0.2)',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  color: theme.palette.rfSecondary,
}))

export const StyledListWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflowY: 'auto',
  overflowX: 'auto',
  height: '100%',
  fontSize: '0.875rem',
  ...theme.customStyles.scrollbar,
}))
