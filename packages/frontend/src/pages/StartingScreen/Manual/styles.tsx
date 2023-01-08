import { Divider, Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(4),
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledLine = styled(Divider)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.rfLinesLight,
}))
