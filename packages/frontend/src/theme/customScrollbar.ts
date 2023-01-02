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
    backgroundColor: palette.rfBackground,
  },
  '&::-webkit-scrollbar-thumb': {
    width: '4px',
    borderRadius: '8px',
    backgroundColor: palette.rfDisabled,
  },
  '&::-webkit-scrollbar': {
    width: '8px',
  },
}
