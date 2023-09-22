import type { StackProps } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'

import type { TTreeMapData } from '../../../../../types'
import type { TMainTraceLogsWithId } from '../../../../../store/traceLogs/traceLogs.types'

export interface ItemBoxProps extends StackProps {
  treeMapItem: TTreeMapData & { item: TMainTraceLogsWithId }
  parentHoverHandler?: Dispatch<SetStateAction<boolean>>
}
