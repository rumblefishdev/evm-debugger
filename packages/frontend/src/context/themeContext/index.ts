import { ThemeContextProvider as OwnThemeContextProvider } from './themeContext'

let ImportedThemeContextProvider: typeof OwnThemeContextProvider
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImportedThemeContextProvider = require('@rumblefishdev/ui/lib/context/themeContext/themeContext').ThemeContextProvider
} catch {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImportedThemeContextProvider = OwnThemeContextProvider
}

export const ThemeContextProvider = ImportedThemeContextProvider
