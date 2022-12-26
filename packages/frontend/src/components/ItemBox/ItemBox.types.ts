import type { StackProps } from '@mui/material'

import type { TDimmensions, TMainTraceLogsWithId } from '../../types'

export interface ItemBoxProps extends StackProps {
  item: TMainTraceLogsWithId & TDimmensions
}
