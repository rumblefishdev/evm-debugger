import { Box, Stack } from '@mui/material'
import React from 'react'

import { StyledStack } from './styles'

export const Layout = ({ children }: React.PropsWithChildren) => (
  <StyledStack>
    <Box sx={{ width: '100%', height: '80px', background: 'orange' }} />
    <Stack
      sx={{
        minHeight: '900px',
        flexGrow: 1,
        alignItems: 'center',
      }}
    >
      {children}
    </Stack>
    <Box sx={{ width: '100%', height: '348px', background: 'blue' }} />
  </StyledStack>
)
