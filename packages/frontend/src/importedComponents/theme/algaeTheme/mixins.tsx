/* eslint-disable @typescript-eslint/no-shadow */
import type { Mixins } from '@mui/material/styles/createMixins'
import { createBreakpoints } from '@mui/system'

import { breakpoints as breakpointsValues } from './breakpoints'

const breakpoints = createBreakpoints(breakpointsValues)

declare module '@mui/material/styles/createMixins' {
  interface Mixins {
    hoverTextLightBlue: CSSProperties
    mobilePadding: (paddingY?: string) => CSSProperties
    flexColumnStartStart: CSSProperties
    defaultTransition: CSSProperties
  }
}

const applyMobilePadding = (paddingY = '0px') => {
  return {
    [breakpoints.down('md')]: {
      padding: `${paddingY} 48px`,
    },
    [breakpoints.down('sm')]: {
      padding: `${paddingY} 24px`,
    },
  }
}

export const mixins: Mixins = {
  mobilePadding: applyMobilePadding,
  hoverTextLightBlue: {
    transition: 'all 0.3s ease-in-out',
    color: '#2F57F4',
  },
  flexColumnStartStart: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'flex-start',
  },
  defaultTransition: {
    transition: 'all 0.3s ease-in-out',
  },
} as Mixins
