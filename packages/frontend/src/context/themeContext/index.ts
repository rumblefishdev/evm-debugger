import { ThemeContextProvider as OwnThemeContextProvider } from "./themeContext";

export let ThemeContextProvider: typeof OwnThemeContextProvider
try {
    ThemeContextProvider = require('@rumblefishdev/ui/lib/context/themeContext/themeContext').ThemeContextProvider
} catch {
    ThemeContextProvider = OwnThemeContextProvider
}