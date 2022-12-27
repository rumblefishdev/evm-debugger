import type { TooltipProps } from '@mui/material'

export interface TreemapTooltipProps extends Omit<TooltipProps, 'title'> {
  type: string
  stackTrace: number[]
  gasCost: number
}
