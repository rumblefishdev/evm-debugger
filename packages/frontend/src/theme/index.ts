import type { ThemeOptions } from '@mui/material'
import { createTheme } from '@mui/material'

import { palette } from './colors'
import { typography } from './typography'
import { scrollbar } from './customScrollbar'

const spacing = 4

export const theme = createTheme({
  typography,
  spacing,
  palette,
  customStyles: {
    scrollbar,
  },
} as ThemeOptions)
