import { Stack, styled } from '@mui/material'

export const StyledContentWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  paddingBottom: theme.spacing(4),
  height: '100%',
  gap: theme.spacing(1),
  boxSizing: 'border-box',
}))

export const StyledPanelsWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '100%',
  gap: theme.spacing(4),
  flexDirection: 'row',
}))
