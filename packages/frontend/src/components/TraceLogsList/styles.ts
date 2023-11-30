import { Stack, Typography, styled } from '@mui/material'

export const TraceLogElement = styled('div')(({ theme }) => ({
  minHeight: theme.spacing(6),
  height: theme.spacing(6),
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

export const StyledSmallPanel = styled(Stack)(() => ({
  width: '100%',
  overflow: 'auto',
  height: '100%',
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(3),
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
  overflowX: 'hidden',
  height: '100%',

  borderTopLeftRadius: '3px',
  borderBottomLeftRadius: '3px',
  borderBottom: `1px solid ${theme.palette.rfLinesLight}`,
  ...theme.customStyles.scrollbar,
}))
