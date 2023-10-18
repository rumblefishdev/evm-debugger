import { Stack, Typography, styled } from '@mui/material'

export const StyledSourceCodePanel = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  height: 'calc(50vh - 3rem)',
}))

export const StyledSourceWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  overflowY: 'scroll',
  height: '100%',
  display: 'flex',
  columnGap: theme.spacing(2),
}))

export const NoSourceCodeHero = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing(16)} ${theme.spacing(8)}`,
  justifyContent: 'center',
  fontSize: theme.typography.body1.fontSize,
  display: 'flex',
  alignItems: 'center',
}))
