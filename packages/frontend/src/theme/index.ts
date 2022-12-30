import type { ThemeOptions } from '@mui/material'
import { createTheme } from '@mui/material'

import { palette } from './colors'

const spacing = 8

export const theme = createTheme({
  spacing,
  palette,
} as ThemeOptions)
