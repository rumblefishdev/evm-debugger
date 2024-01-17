/* eslint-disable @typescript-eslint/no-shadow */
import type { ThemeOptions } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import { isMobile, fluidSize, getViewportHeight, isPhone, isWebkit } from '@rumblefishdev/ui/lib/src/theme/rumblefish23Theme/utils'

import { breakpoints } from './breakpoints'
import { mixins } from './mixins'
import { overrides as components } from './overrides'
import { palette } from './palette'
import type { ExtendedTypographyPropsVariantOverrides1 } from './typography'
import { typography } from './typography'
import type { ExtendedTypographyPropsVariantOverrides2 } from './typography2'
import { typography2 } from './typography2'
import { fluidFont } from './utilis'

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides extends ExtendedTypographyPropsVariantOverrides1, ExtendedTypographyPropsVariantOverrides2 {}
}

const spacing = 8

export const theme = createTheme({
  utils: {
    isWebkit,
    isPhone,
    isMobile,
    getViewportHeight,
    fluidSize,
    fluidFont,
  },
  typography: { ...typography, ...typography2 },
  spacing,
  palette,
  mixins,
  components,
  breakpoints,
} as ThemeOptions)
