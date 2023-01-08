import type { StackProps } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'

import type {
  TDimmensions,
  TMainTraceLogsWithId,
  TTreeMapData,
} from '../../../../../types'

export interface ItemBoxProps extends StackProps {
  treeMapItem: TTreeMapData & { item: TMainTraceLogsWithId }
  parentHoverHandler?: Dispatch<SetStateAction<boolean>>
}
