import { Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  justifyContent: 'flex-start',
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledContentWrapper = styled(Stack)(() => ({
  overflow: 'hidden',
  maxHeight: 'calc(100% - 96px - 64px - 24px)',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledButtonsWrapper = styled(Stack)(() => ({
  width: '480px',
  marginBottom: '24px',
  justifyContent: 'space-around',
  height: '64px',
  flexDirection: 'row',
  alignItems: 'center',
}))
