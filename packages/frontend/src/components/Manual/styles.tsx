import { Divider, Stack, styled, Typography } from '@mui/material'
/* eslint sort-keys-fix/sort-keys-fix:0*/
export const StyledStack = styled(Stack)(({ theme }) => ({
  height: '160px',
  width: '100%',
  gap: theme.spacing(1),
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'center',
}))

export const StyledLine = styled(Divider)(() => ({
  width: '100%',
  backgroundColor: 'rgba(193, 199, 205, 0.15)',
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
