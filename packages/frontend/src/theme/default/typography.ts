import type { TypographyOptions } from '@mui/material/styles/createTypography'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    buttonSmall: React.CSSProperties
    bodySmallBold: React.CSSProperties
    buttonBig: React.CSSProperties
    buttonMedium: React.CSSProperties
    bodySmall: React.CSSProperties
    label: React.CSSProperties
    caption: React.CSSProperties
    inputText: React.CSSProperties
    uppercase: React.CSSProperties
    heading4: React.CSSProperties
    headingUnknown: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    buttonSmall?: React.CSSProperties
    bodySmallBold?: React.CSSProperties
    buttonBig?: React.CSSProperties
    buttonMedium?: React.CSSProperties
    bodySmall?: React.CSSProperties
    label?: React.CSSProperties
    caption?: React.CSSProperties
    inputText: React.CSSProperties
    uppercase: React.CSSProperties
    heading4: React.CSSProperties
    headingUnknown: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    buttonSmall: true
    buttonBig: true
    bodySmall: true
    bodySmallBold: true
    label: true
    caption: true
    inputText: true
    uppercase: true
    heading4: true
    headingUnknown: true
  }
}

export const typography: TypographyOptions = {
  uppercase: {
    textAlign: 'left',
    lineHeight: '18px',
    letterSpacing: '0.25em',
    fontWeight: 600,
    fontSize: '14px',
    fontFamily: 'Rajdhani',
  },
  label: {
    textAlign: 'left',
    lineHeight: '12px',
    letterSpacing: '0.02em',
    fontWeight: 600,
    fontSize: '12px',
    fontFamily: 'Rajdhani',
  },
  inputText: {
    textAlign: 'left',
    lineHeight: '23px',
    letterSpacing: '-0.01em',
    fontWeight: 400,
    fontSize: '15px',
    fontFamily: 'Inter',
  },

  headingUnknown: {
    textAlign: 'left',
    lineHeight: '24px',
    letterSpacing: '-0.02em',
    fontWeight: 600,
    fontSize: '24px',
    fontFamily: 'Rajdhani',
  },
  heading4: {
    textAlign: 'left',
    lineHeight: '47px',
    letterSpacing: '-0.02em',
    fontWeight: 600,
    fontSize: '47px',
    fontFamily: 'Rajdhani',
  },
  caption: {
    textAlign: 'center',
    lineHeight: '18px',
    letterSpacing: '-0.01em',
    fontWeight: 400,
    fontSize: '12px',
    fontFamily: 'Inter',
  },
  buttonSmall: {
    textAlign: 'center',
    lineHeight: '15px',
    letterSpacing: '-0.01em',
    fontWeight: 600,
    fontSize: '15px',
    fontFamily: 'Rajdhani',
  },
  buttonMedium: {
    textAlign: 'center',
    lineHeight: '15px',
    letterSpacing: '-0.01em',
    fontWeight: 600,
    fontSize: '18px',
    fontFamily: 'Rajdhani',
  },
  buttonBig: {
    textAlign: 'center',
    lineHeight: '20px',
    letterSpacing: '-0.01em',
    fontWeight: 600,
    fontSize: '20px',
    fontFamily: 'Rajdhani',
  },
  bodySmallBold: {
    lineHeight: '22.51px',
    letterSpacing: '-0.01em',
    fontWeight: 600,
    fontSize: '14px',
    fontFamily: 'Inter',
  },
  bodySmall: {
    lineHeight: '22.51px',
    letterSpacing: '-0.01em',
    fontWeight: 400,
    fontSize: '14px',
    fontFamily: 'Inter',
  },
}
