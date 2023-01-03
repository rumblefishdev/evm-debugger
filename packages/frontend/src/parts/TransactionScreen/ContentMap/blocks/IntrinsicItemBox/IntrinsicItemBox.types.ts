import type { BoxProps } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'

import type { TDimmensions, TIntrinsicLog, TTreeMapData } from '../../../../../types'

export interface IntrinsicItemBoxProps extends BoxProps {
  treeMapItem: TTreeMapData & { item: TIntrinsicLog }
  parentHoverHandler?: Dispatch<SetStateAction<boolean>>
}
