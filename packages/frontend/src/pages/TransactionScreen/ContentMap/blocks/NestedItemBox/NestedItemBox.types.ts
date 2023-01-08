import type { BoxProps } from '@mui/material'

import type { TMainTraceLogsWithId, TTreeMapData } from '../../../../../types'

export interface NestedItemBoxProps extends BoxProps {
  treeMapItem: TTreeMapData & { item: TMainTraceLogsWithId }
}
