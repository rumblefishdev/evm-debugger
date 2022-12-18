import { Button, Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  width: '720px',
  justifyContent: 'space-around',
  height: '96px',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledButton = styled(Button)(() => ({
  margin: '0 12px',
}))
