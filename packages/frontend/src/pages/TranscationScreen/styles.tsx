import { Stack, styled } from '@mui/material'

export const StyledWrapper = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'space-between',
  height: 'calc(100% - 96px)',
  flexDirection: 'row',
  alignItems: 'center',
}))
