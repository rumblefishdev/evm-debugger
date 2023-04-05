import { Stack, styled } from '@mui/material'

type TWithNavbar = {
  withNavbar?: boolean
}

export const StyledWrapper = styled(Stack)(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}))

export const StyledContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'withNavbar',
})<TWithNavbar>(({ theme, withNavbar }) => ({
  width: '100%',
  padding: theme.spacing(6),
  overflow: 'hidden',
  // maxWidth: '1600px',
  justifyContent: 'center',
  height: withNavbar ? 'calc(100vh - 48px)' : '100vh',
  gap: theme.spacing(6),
  flexDirection: 'row',
  boxSizing: 'border-box',
  alignItems: 'center',
}))
