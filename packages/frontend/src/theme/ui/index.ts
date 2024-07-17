import type { Theme } from '@mui/material'

import { themeDark, themeNavy } from '../algaeTheme'

let importedThemes: { dark: Theme; navy: Theme }
try {
  importedThemes = {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    navy: require('@rumblefishdev/ui/lib/src/theme/algaeTheme').themeNavy,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    dark: require('@rumblefishdev/ui/lib/src/theme/rumblefish23Theme').themeDark,
  }
} catch {
  importedThemes = {
    navy: themeNavy,
    dark: themeDark,
  }
}

export const themes = importedThemes
