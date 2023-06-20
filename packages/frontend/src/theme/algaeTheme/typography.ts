import type { TypographyOptions } from '@mui/material/styles/createTypography'
import { createBreakpoints } from '@mui/system'
import type { CSSProperties } from 'react'

import { breakpoints as breakpointsValues } from './breakpoints'
import { palette } from './palette'

const breakpoints = createBreakpoints(breakpointsValues)

const rajdhaniStyle = {
  lineHeight: '120%',
  fontWeight: 600,
  fontStyle: 'normal',
  fontFamily: 'Rajdhani',
  color: palette.colorBlack,
}
const interStyle = {
  lineHeight: '150%',
  fontWeight: 400,
  fontSize: '1rem',
  fontFamily: 'Inter',
  color: palette.colorBlack,
}
const bodyStyle = {
  lineHeight: '150%',
  fontSize: '1.125rem',
  fontFamily: 'Inter',
  color: palette.colorGrey?.primary,
  [breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}
const bodySmallStyle = {
  lineHeight: '150%',
  fontSize: '0.875rem',
  fontFamily: 'Inter',
  color: palette.colorGrey?.primary,
  [breakpoints.down('sm')]: {
    fontSize: '0.812rem',
  },
}
export interface ExtendedTypographyPropsVariantOverrides1 {
  buttonSmall: true
  buttonRegular: true
  buttonSmallLink: true
  form: true
  formLink: true
  body: true
  bodyBold: true
  bodyItalic: true
  bodyItalicBold: true
  bodyLink: true
  bodyLinkBold: true
  bodySmall: true
  bodySmallBold: true
  bodySmallItalic: true
  bodySmallItalicBold: true
  bodySmallLink: true
  bodySmallLinkBold: true
  uppercase: true
}
export interface ExtendedTypographyOptions extends TypographyOptions {
  buttonSmall: CSSProperties
  buttonRegular: CSSProperties
  buttonSmallLink: CSSProperties
  form: CSSProperties
  formLink: CSSProperties
  body: CSSProperties
  bodyBold: CSSProperties
  bodyItalic: CSSProperties
  bodyItalicBold: CSSProperties
  bodyLink: CSSProperties
  bodyLinkBold: CSSProperties
  bodySmall: CSSProperties
  bodySmallBold: CSSProperties
  bodySmallItalic: CSSProperties
  bodySmallItalicBold: CSSProperties
  bodySmallLink: CSSProperties
  bodySmallLinkBold: CSSProperties
  uppercase: CSSProperties
}

export const typography = {
  uppercase: {
    ...rajdhaniStyle,
    textTransform: 'uppercase',
    letterSpacing: '0.25em',
    fontSize: '0.875rem',
    color: palette.colorBrand?.secondary,
  },
  formLink: {
    ...interStyle,
    textDecoration: 'underline',
  },
  form: {
    ...interStyle,
  },
  fontFamily: ['Rajdhani,Inter'].join(','),
  buttonSmallLink: {
    ...rajdhaniStyle,
    textDecoration: 'underline',
    letterSpacing: '0,05em',
    fontSize: '0.875rem',
  },
  buttonSmall: {
    ...rajdhaniStyle,
    letterSpacing: '0,05em',
    fontSize: '0.875rem',
  },
  buttonRegular: {
    ...rajdhaniStyle,
    letterSpacing: '0,05em',
    fontSize: '1rem',
  },
  bodySmallLinkBold: {
    ...bodySmallStyle,
    textDecoration: 'underline',
    fontWeight: 600,
    fontStyle: 'normal',
    color: palette.colorLink,
  },
  bodySmallLink: {
    ...bodySmallStyle,
    textDecoration: 'underline',
    fontWeight: 400,
    fontStyle: 'normal',
    color: palette.colorLink,
  },
  bodySmallItalicBold: {
    ...bodySmallStyle,
    fontWeight: 600,
    fontStyle: 'italic',
  },
  bodySmallItalic: {
    ...bodySmallStyle,
    fontWeight: 400,
    fontStyle: 'italic',
  },
  bodySmallBold: {
    ...bodySmallStyle,
    fontWeight: 600,
    fontStyle: 'normal',
  },
  bodySmall: {
    ...bodySmallStyle,
    fontWeight: 400,
    fontStyle: 'normal',
  },
  bodyLinkBold: {
    ...bodyStyle,
    textDecoration: 'underline',
    fontWeight: 600,
    fontStyle: 'normal',
  },
  bodyLink: {
    ...bodyStyle,
    textDecoration: 'underline',
    fontWeight: 400,
    fontStyle: 'normal',
    color: palette.colorLink,
  },
  bodyItalicBold: {
    ...bodyStyle,
    fontWeight: 600,
    fontStyle: 'italic',
  },
  bodyItalic: {
    ...bodyStyle,
    fontWeight: 400,
    fontStyle: 'italic',
  },
  bodyBold: {
    ...bodyStyle,
    fontWeight: 600,
    fontStyle: 'normal',
  },
  body: {
    ...bodyStyle,
    fontWeight: 400,
    fontStyle: 'normal',
  },
} as ExtendedTypographyOptions
