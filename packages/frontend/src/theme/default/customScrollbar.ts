import type { CSSProperties } from 'react'

import { palette } from './colors'

declare module '@mui/material/styles' {
  interface Theme {
    customStyles: {
      scrollbar: CSSProperties
    }
  }
  interface ThemeOptions {
    customStyles?: {
      scrollbar: CSSProperties
    }
  }
}

export const scrollbar = {
  '&::-webkit-scrollbar-track': {
    width: '8px',
    height: '6px',
    backgroundColor: palette.rfBackground,
  },
  '&::-webkit-scrollbar-thumb': {
    height: '60px',
    boxShadow: `inset 0 0 100px ${palette.rfDisabled}`,
    borderRight: '2px solid transparent',
    borderRadius: '8px',
    borderLeft: '2px solid transparent',
    backgroundColor: palette.rfDisabled,
    background: 'transparent',
  },
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '6px',
  },
}
