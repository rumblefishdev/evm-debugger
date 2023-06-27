import type { TypographyOptions } from '@mui/material/styles/createTypography'
import { createBreakpoints } from '@mui/system'
import type { CSSProperties } from 'react'

import { breakpoints as breakpointsValues } from './breakpoints'
import { palette } from './palette'
import { fluidFont } from './utilis'

const breakpoints = createBreakpoints(breakpointsValues)

const rajdhaniStyle = {
  lineHeight: '100%',
  letterSpacing: '-0.02em',
  fontWeight: 600,
  fontStyle: 'normal',
  fontFamily: 'Rajdhani',
  display: 'inline-block',
  color: palette.colorBlack,
}

const interStyle = {
  lineHeight: '150%',
  letterSpacing: '-0.01em',
  fontWeight: 400,
  fontSize: '1rem',
  fontFamily: 'Inter',
  color: palette.colorBlack,
}
export interface ExtendedTypographyPropsVariantOverrides2 {
  uppercase: true
  heading1: true
  heading2: true
  heading3: true
  heading4: true
  heading5: true
  heading6: true
  body2Big: true
  body2Small: true
  subtitle: true
}

export interface ExtendedTypographyOptions extends TypographyOptions {
  uppercase: CSSProperties
  heading1: CSSProperties
  heading2: CSSProperties
  heading3: CSSProperties
  heading4: CSSProperties
  heading5: CSSProperties
  heading6: CSSProperties
  body2Big: CSSProperties
  body2Small: CSSProperties
  subtitle: CSSProperties
}
export const typography2 = {
  uppercase: {
    ...rajdhaniStyle,
    textTransform: 'uppercase',
    letterSpacing: '0.25em',
    fontSize: '0.875rem',
    color: palette.colorBrand?.secondary,
  },
  subtitle: {
    lineHeight: '150%',
    letterSpacing: '-0.01em',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: fluidFont(19.2, 26.66),
    fontFamily: 'Inter',
    color: palette.colorBlack,
    [breakpoints.up(1136)]: {
      fontSize: '26.66px',
    },
  },
  heading6: {
    ...rajdhaniStyle,
    fontSize: fluidFont(19.2, 26.66),
    [breakpoints.up(1136)]: {
      fontSize: '26.66px',
    },
  },
  heading5: {
    ...rajdhaniStyle,
    fontSize: fluidFont(23.04, 35.54),
    [breakpoints.up(1136)]: {
      fontSize: '35.54px',
    },
  },
  heading4: {
    ...rajdhaniStyle,
    fontSize: fluidFont(27.65, 47.37),
    [breakpoints.up(1136)]: {
      fontSize: '47.37px',
    },
  },
  heading3: {
    ...rajdhaniStyle,
    fontSize: fluidFont(33.18, 63.15),
    [breakpoints.up(1136)]: {
      fontSize: '63.15px',
    },
  },
  heading2: {
    ...rajdhaniStyle,
    fontSize: fluidFont(39.81, 84.17),
    [breakpoints.up(1136)]: {
      fontSize: '84.17px',
    },
  },
  heading1: {
    ...rajdhaniStyle,
    fontSize: fluidFont(47.78, 112.2),
    [breakpoints.up(1136)]: {
      fontSize: '112.2px',
    },
  },
  body2Small: {
    ...interStyle,
    fontSize: fluidFont(13.33, 15),
    [breakpoints.up(1136)]: {
      fontSize: '15px',
    },
  },
  body2Big: {
    ...interStyle,
    fontSize: fluidFont(16, 20),
    [breakpoints.up(1136)]: {
      fontSize: '20px',
    },
  },
}
