import type { StackProps } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'

import type { TDimmensions, TMainTraceLogsWithId } from '../../types'

export interface ItemBoxProps extends StackProps {
  item: TMainTraceLogsWithId & TDimmensions
  parentHoverHandler?: Dispatch<SetStateAction<boolean>>
}
