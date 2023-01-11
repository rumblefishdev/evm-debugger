/* eslint-disable @typescript-eslint/no-shadow */
import type { Palette, PaletteColor } from '@mui/material'

declare module '@mui/material/styles/createPalette' {
  interface BrandPaletteColorOptions {
    primary: string
    secondary: string
  }
  interface BrandPaletteColor {
    primary: string
    secondary: string
  }
  interface BackgroundPaletteColorOptions {
    dark: string
    light: string
  }
  interface BackgroundPaletteColor {
    dark: string
    light: string
    darkPurple: string
  }
  interface GreyPaletteColorOptions {
    primary: string
    light: string
    shade00: string
    shade10: string
    shade20: string
    shade30: string
    shade50: string
    shade60: string
    shade70: string
  }
  interface GreyPaletteColor {
    primary: string
    light: string
    lightSecondary: string
    shade00: string
    shade10: string
    shade20: string
    shade30: string
    shade50: string
    shade60: string
    shade70: string
    disabledDark: string
  }

  interface PaletteOptions {
    colorBrand?: BrandPaletteColorOptions
    colorLink?: string
    colorBlack?: string
    colorBackground?: BackgroundPaletteColorOptions
    colorLines?: string
    colorLines50?: string
    colorGrey?: GreyPaletteColorOptions
    colorWhite?: string
  }
  interface Palette {
    colorBrand?: BrandPaletteColor
    colorLink?: string
    colorBlack?: string
    colorBackground?: BackgroundPaletteColor
    colorLines?: string
    colorLines50?: string
    colorGrey?: GreyPaletteColor
    colorWhite?: string
  }
}

export const palette: Palette = {
  // Used in RichTextGlobal and RichTextLandingPages
  // So when storybook is using algeaTheme, this line is needed in order for it to work
  // Otherwise storybook won't load stories
  secondary: {
    main: '#C1C7CD',
  } as PaletteColor,

  colorWhite: '#FFFFFF',

  colorLink: '#2F57F4',

  colorLines50: '#EDEDED',

  colorLines: '#C8C8C8',

  colorGrey: {
    shade70: '#343A3F',
    shade60: '#4D5358',
    shade50: '#697077',
    shade30: '#A2A9B0',
    shade20: '#C1C7CD',
    shade10: '#DDE1E6',
    shade00: '#F2F4F8',
    primary: '#494949',
    lightSecondary: '#F5F6F8',
    light: '#747474',
    disabledDark: '#697077',
  },

  colorBrand: {
    secondary: '#F9277F',
    primary: '#01196F',
  },

  colorBlack: '#070706',

  colorBackground: {
    light: '#F8F8F7',
    darkPurple: '#171019',
    dark: '#F2F1F2',
  },
} as Palette
