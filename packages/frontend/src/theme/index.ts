import type { ThemeOptions } from '@mui/material'
import { createTheme } from '@mui/material'

import { palette } from './colors'
import { typography } from './typography'

const spacing = 4

export const theme = createTheme({
  typography,
  spacing,
  palette,
} as ThemeOptions)
