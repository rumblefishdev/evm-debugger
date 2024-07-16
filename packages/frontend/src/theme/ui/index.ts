import { Theme } from "@mui/material"
import { themeDark, themeNavy } from "../algaeTheme"

export let themes: { dark: Theme, navy: Theme }
try {
    themes = {
        dark: require('@rumblefishdev/ui/lib/src/theme/rumblefish23Theme').themeDark,
        navy: require('@rumblefishdev/ui/lib/src/theme/algaeTheme').themeNavy
    }
} catch {
    themes = {
        dark: themeDark,
        navy: themeNavy
    }
}
