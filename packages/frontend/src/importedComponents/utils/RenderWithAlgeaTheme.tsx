import { ThemeProvider, CssBaseline } from '@mui/material'
import React from 'react'

import { theme } from '../theme/algaeTheme'

export const RenderWithAlgeaTheme: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
