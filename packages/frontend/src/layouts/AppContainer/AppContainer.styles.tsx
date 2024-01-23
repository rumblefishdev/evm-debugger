import { Stack, styled } from '@mui/material'

export const StyledAppWrapper = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'center',
  height: '100%',
  alignItems: 'center',
}))

export const StyledAppContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'withNavbar',
})<{ withNavbar?: boolean }>(({ theme, withNavbar }) => ({
  width: '100%',
  padding: theme.spacing(2),
  overflow: 'auto',
  justifyContent: 'center',
  height: withNavbar ? 'calc(100vh - 58px)' : '100vh',
  gap: theme.spacing(6),
  flexDirection: 'row',
  boxSizing: 'border-box',
  backgroundColor: '#F8F8F8',
  alignItems: 'center',
}))
