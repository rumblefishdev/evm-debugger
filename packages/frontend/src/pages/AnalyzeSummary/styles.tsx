import { Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'center',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledWrapper = styled(Stack)(() => ({
  width: '95%',
  justifyContent: 'flex-start',
  height: '90%',
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledContentWrapper = styled(Stack)(() => ({
  overflow: 'hidden',
  justifyContent: 'flex-start',
  height: 'calc(100% - 96px)',
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
