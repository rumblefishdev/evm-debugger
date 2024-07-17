/* eslint-disable @typescript-eslint/naming-convention */
import type { ThemeOptions } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

import noiseBg from '../../assets/png/noise.png'

import { scrollbar } from './customScrollbar'
import { breakpoints } from './breakpoints'
import { mixins } from './mixins'
import { overrides as components } from './overrides'
import { palette, paletteDark, paletteNavy } from './palette'
import type { ExtendedTypographyPropsVariantOverrides1 } from './typography'
import { typography } from './typography'
import type { ExtendedTypographyPropsVariantOverrides2 } from './typography2'
import { typography2 } from './typography2'
import type { IFluidSize } from './utilis'
import { fluidFont, isMobile, fluidSize } from './utilis'

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides extends ExtendedTypographyPropsVariantOverrides1, ExtendedTypographyPropsVariantOverrides2 {}
}

declare module '@mui/material/styles' {
  interface Theme {
    utils: {
      isMobile: () => boolean
      fluidFont: (min: number, max: number) => string
      fluidSize: ({ minSize, maxSize, increase, maxBp, minBp }: IFluidSize) => string
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface ThemeOptions {
    utils?: {
      isMobile: () => boolean
      fluidFont: (min: number, max: number) => string
      fluidSize: ({ minSize, maxSize, increase, maxBp, minBp }: IFluidSize) => string
    }
  }
}

const spacing = 8

export const algaeTheme = createTheme({
  utils: {
    isMobile,
    fluidSize,
    fluidFont,
  },
  typography: { ...typography, ...typography2 },
  spacing,
  palette,
  mixins,
  customStyles: {
    scrollbar,
  },
  components,
  breakpoints,
} as ThemeOptions)

export const themeDark = createTheme({
  utils: {
    isMobile,
    fluidSize,
    fluidFont,
  },
  typography: { ...typography, ...typography2 },
  spacing,
  palette: paletteDark,
  mixins,
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
            background: url(${noiseBg}), #121B1C;
          }
        `,
    },
  },
  breakpoints,
} as ThemeOptions)

export const themeNavy = createTheme({
  utils: {
    isMobile,
    fluidSize,
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
