import { Stack, styled } from '@mui/material'

export const StyledFunctionEntryWrapper = styled(Stack)(({ theme }) => ({}))
export const StyledFunctionEntryBody = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  gap: theme.spacing(1),
  flexDirection: 'row',
}))

export const StyledFunctionEntryLeftWrapper = styled(Stack)(({ theme }) => ({
  minWidth: '128px',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledFunctionEntryContent = styled(Stack)(({ theme }) => ({
  //   padding: theme.spacing(1, 0),
  flexDirection: 'row',
}))
