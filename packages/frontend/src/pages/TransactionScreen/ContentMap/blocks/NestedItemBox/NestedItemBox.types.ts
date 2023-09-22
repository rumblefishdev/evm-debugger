import type { BoxProps } from '@mui/material'

import type { TTreeMapData } from '../../../../../types'
import type { TMainTraceLogsWithId } from '../../../../../store/traceLogs/traceLogs.types'

export interface NestedItemBoxProps extends BoxProps {
  treeMapItem: TTreeMapData & { item: TMainTraceLogsWithId }
}
