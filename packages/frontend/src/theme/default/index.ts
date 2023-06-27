import type { ThemeOptions } from '@mui/material'
import { createTheme } from '@mui/material'

import { mixins } from './mixins'
import { palette } from './colors'
import { typography } from './typography'
import { scrollbar } from './customScrollbar'

const spacing = 8

export const theme = createTheme({
  typography,
  spacing,
  palette,
  mixins,
  customStyles: {
    scrollbar,
  },
} as ThemeOptions)
