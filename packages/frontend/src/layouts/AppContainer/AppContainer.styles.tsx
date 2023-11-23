import { Stack, styled } from '@mui/material'

export const StyledWrapper = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'center',
  height: '100%',
  alignItems: 'center',
}))

export const StyledContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'withNavbar',
})<{ withNavbar?: boolean }>(({ theme, withNavbar }) => ({
  width: '100%',
  padding: theme.spacing(6),
  overflow: 'hidden',
  justifyContent: 'center',
  height: withNavbar ? 'calc(100vh - 48px)' : '100vh',
  gap: theme.spacing(6),
  flexDirection: 'row',
  boxSizing: 'border-box',
  alignItems: 'center',
}))
