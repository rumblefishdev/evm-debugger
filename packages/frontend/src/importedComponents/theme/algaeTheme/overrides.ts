import type { Components } from '@mui/material'
import { createBreakpoints } from '@mui/system'

import { breakpoints as breakpointsValues } from './breakpoints'
import { palette } from './palette'

const breakpoints = createBreakpoints(breakpointsValues)

const headingStyle = {
  lineHeight: '120%',
  fontWeight: 600,
  fontStyle: 'normal',
  fontFamily: 'Rajdhani',
  color: palette.colorBlack,
}

export const overrides: Components = {
  MuiTypography: {
    styleOverrides: {
      overline: {
        ...headingStyle,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '0.75rem',
      },
      h6: {
        ...headingStyle,
        fontSize: '1.438rem',
        [breakpoints.down('sm')]: {
          fontSize: '1.125rem',
        },
      },
      h5: {
        ...headingStyle,
        fontSize: '1.75rem',
        [breakpoints.down('sm')]: {
          fontSize: '1.438rem',
        },
      },
      h4: {
        ...headingStyle,
        fontSize: '2.188rem',
        [breakpoints.down('sm')]: {
          fontSize: '1.75rem',
        },
      },
      h3: {
        ...headingStyle,
        fontSize: '2.75rem',
        [breakpoints.down('sm')]: {
          fontSize: '2.063rem',
        },
      },
      h2: {
        ...headingStyle,
        fontSize: '3.438rem',
        [breakpoints.down('sm')]: {
          fontSize: '2.5rem',
        },
      },
      h1: {
        ...headingStyle,
        fontSize: '4.313rem',
        [breakpoints.down('sm')]: {
          fontSize: '3rem',
        },
      },
      caption: {
        lineHeight: '150%',
        fontWeight: '400',
        fontSize: '0.75rem',
        fontFamily: 'Inter',
        color: '#343A3F',
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: `
    @font-face {
      font-family: Rajdhani;
      font-style: light;
      font-display: swap;
      font-weight: 300;
      src:
        local('Rajdhani-Light'),
        url(/fonts/Rajdhani-Light.ttf)
     }
    @font-face {
      font-family: Rajdhani;
      font-style: regular;
      font-display: swap;
      font-weight: 400;
      src:
        local('Rajdhani-Regular'),
        url(/fonts/Rajdhani-Regular.ttf)
     }
    @font-face {
      font-family: Rajdhani;
      font-style: medium;
      font-display: swap;
      font-weight: 500;
      src:
        local('Rajdhani-Medium'),
        url(/fonts/Rajdhani-Medium.ttf)
     }
    @font-face {
      font-family: Rajdhani;
      font-style: semi-bold;
      font-display: swap;
      font-weight: 600;
      src:
        local('Rajdhani-SemiBold'),
        url(/fonts/Rajdhani-SemiBold.ttf)
     }
    @font-face {
      font-family: Rajdhani;
      font-style: bold;
      font-display: swap;
      font-weight: 700;
      src:
        local('Rajdhani-Bold'),
        url(/fonts/Rajdhani-Bold.ttf)
     }
    @font-face {
      font-family: Inter;
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src:
        local('Inter-Regular'),
        url(/fonts/Inter-Regular.otf)
     }
    @font-face {
      font-family: Inter;
      font-style: normal;
      font-display: swap;
      font-weight: 700;
      src:
        local('Inter-Bold'),
        url(/fonts/Inter-Bold.otf)
     }
    @font-face {
      font-family: Inter;
      font-style: normal;
      font-display: swap;
      font-weight: 600;
      src:
        local('Inter-SemiBold'),
        url(/fonts/Inter-SemiBold.otf)
     }
     `,
  },
}
