import type { Theme } from '@mui/material'

export const isDarkOrNavy = (theme: Theme) => {
  return ['dark', 'navy'].includes(theme.palette.type)
}
