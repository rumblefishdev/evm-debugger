import { Button, Stack, styled, Typography } from '@mui/material'

export const StyledDisabledBytecode = styled(Stack)(() => ({
  width: '100%',
  textAlign: 'center',
  padding: '8px 16px',
  justifyContent: 'center',
  height: '100%',
  flexDirection: 'column',
  background: 'rgba(0, 0, 0, 0.38)',
  alignItems: 'center',
}))

export const StyledButton = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  transform: `translate(${theme.spacing(2)}, -50%)`,
  top: '50%',
  position: 'absolute',
}))

export const NoSourceCodeHero = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing(16)} ${theme.spacing(8)}`,
  justifyContent: 'center',
  fontSize: theme.typography.body1.fontSize,
  display: 'flex',
  alignItems: 'center',
}))

export const StyledSourceSection = styled('div')(({ theme }) => ({
  width: '100%',
  flexDirection: 'column',
  display: 'flex',
  '> div': {
    width: '100% !important',
  },
  '& + span': {
    marginTop: theme.spacing(2),
  },
}))

export const StyledSourceSectionHeading = styled(Typography)(({ theme }) => ({
  zIndex: 10,
  top: 0,
  position: 'sticky',
  padding: `${theme.spacing(2)} 0`,
  fontSize: theme.typography.h6.fontSize,
  display: 'block',
  color: theme.palette.rfSecondary,
  boxShadow: `0 1px 0 0 ${theme.palette.rfLinesLight}`,
  background: 'white',
}))
