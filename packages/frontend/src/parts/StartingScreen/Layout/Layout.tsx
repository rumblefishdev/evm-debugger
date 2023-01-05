import { Box, Stack } from '@mui/material'
import React from 'react'

import type { LayoutProps } from './Layout.types'
import { StyledStack } from './styles'

export const Layout = ({ children, ...props }: LayoutProps) => (
  <StyledStack {...props}>
    <Box sx={{ width: '100%', height: '80px', background: 'orange' }} />
    <Stack
      sx={{
        minHeight: '900px',
        justifyContent: 'center',
        flexGrow: 1,
        alignItems: 'center',
      }}
    >
      {children}
    </Stack>
    <Box sx={{ width: '100%', height: '348px', background: 'blue' }} />
  </StyledStack>
)
