import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'noPadding',
})<{ noPadding?: boolean }>(({ theme, noPadding }) => ({
  padding: noPadding ? 0 : theme.spacing(6, 0),
  borderTop: '1px solid rgba(255,255,255,0.15)',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5, 0, 3, 0),
    height: '100vh',
    boxShadow: 'unset',
  },
}))
