/* eslint-disable @typescript-eslint/naming-convention */
import type { ThemeOptions } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

import noiseBg from '../../importedComponents/assets/png/noise.png'

import { scrollbar } from './customScrollbar'
import { breakpoints } from './breakpoints'
import { mixins } from './mixins'
import { overrides as components } from './overrides'
import { palette, paletteDark, paletteNavy } from './palette'
import type { ExtendedTypographyPropsVariantOverrides1 } from './typography'
import { typography } from './typography'
import type { ExtendedTypographyPropsVariantOverrides2 } from './typography2'
import { typography2 } from './typography2'
import { fluidFont } from './utilis'

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides extends ExtendedTypographyPropsVariantOverrides1, ExtendedTypographyPropsVariantOverrides2 {}
}

declare module '@mui/material/styles' {
  interface Theme {
    utilis: {
      // isMobile: boolean
      fluidFont: (min: number, max: number) => string
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface ThemeOptions {
    utilis?: {
      // isMobile: boolean
      fluidFont: (min: number, max: number) => string
    }
  }
}

const spacing = 8

export const theme = createTheme({
  utilis: {
    isMobile: global.innerWidth <= 960,
    fluidFont,
  },
  typography: { ...typography, ...typography2 },
  spacing,
  palette,
  mixins,
  components,
  breakpoints,
} as ThemeOptions)

export const themeDark = createTheme({
  utilis: {
    isMobile: global.innerWidth <= 960,
    fluidFont,
  },
  typography: { ...typography, ...typography2 },
  spacing,
  palette: paletteDark,
  mixins,
  components: {
    MuiTypography: {
      styleOverrides: { ...components.MuiTypography },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `${components?.MuiCssBaseline?.styleOverrides}
          body {
            background: url(${noiseBg}), #121B1C;
          }
        `,
    },
  },
  breakpoints,
} as ThemeOptions)

export const themeNavy = createTheme({
  utilis: {
    isMobile: global.innerWidth <= 960,
    fluidFont,
  },
  typography: { ...typography, ...typography2 },
  spacing,
  palette: paletteNavy,
  mixins: {
    mobilePadding: mixins.mobilePadding,
    hoverTextLightBlue: {
      transition: 'all 0.3s ease-in-out',
      color: '#FFFFFF',
    },
    flexColumnStartStart: mixins.flexColumnStartStart,
    defaultTransition: mixins.defaultTransition,
  },
  customStyles: {
    scrollbar,
  },
  components: {
    MuiTypography: {
      styleOverrides: { ...components.MuiTypography },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `${components?.MuiCssBaseline?.styleOverrides}
          body {
            background: url(${noiseBg}), #071D5A;
          }
        `,
    },
  },
  breakpoints,
} as ThemeOptions)
