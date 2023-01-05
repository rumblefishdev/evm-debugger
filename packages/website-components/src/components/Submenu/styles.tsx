import type { SxProps, Theme } from '@mui/material'
import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'noPadding',
})<{ noPadding?: boolean }>(({ theme, noPadding }) => ({
  padding: noPadding ? 0 : theme.spacing(6, 0),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5, 0, 3, 0),
    height: '100vh',
    boxShadow: 'unset',
  },
}))

export const PaperStyles: SxProps<Theme> = (theme) => ({
  width: '100%',
  top: '97px',
  overflow: 'auto',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  [theme.breakpoints.down('md')]: {
    top: 0,
    height: '100vh',
    boxShadow: 'unset',
  },
})
