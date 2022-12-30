import type { Palette } from '@mui/material'

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    rfBrandPrimary?: string
    rfBrandSecondary?: string
    rfSecondary?: string
    rfBlack?: string
    rfDisabled?: string
    rfDisabledDark?: string
    rfButton?: string
    rfWhite?: string
    rfLinesLight?: string
    rfText?: string
    rfSuccess?: string
    rfBox?: string
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface Palette {
    rfBrandPrimary?: string
    rfBrandSecondary?: string
    rfSecondary?: string
    rfBlack?: string
    rfDisabled?: string
    rfDisabledDark?: string
    rfButton?: string
    rfWhite?: string
    rfLinesLight?: string
    rfText?: string
    rfSuccess?: string
    rfBox?: string
  }
}

export const palette: Partial<Palette> = {
  rfWhite: '#FFFFFF',
  rfText: '#1C1F22',
  rfSuccess: '#35CBB9',
  rfSecondary: '#343A3F',
  rfLinesLight: '#ECEEF0',
  rfDisabledDark: '#697077',
  rfDisabled: '#A2A9B0',
  rfButton: '#2F57F4',
  rfBrandSecondary: '#F9277F',
  rfBrandPrimary: '#01196F',
  rfBox: '#F9277F1A',
  rfBlack: '#000000',
}
