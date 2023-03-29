import { styled } from '@mui/material'

export const TraceLogElement = styled('div')(({ theme }) => ({
  minHeight: theme.spacing(12),
  height: theme.spacing(12),
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
