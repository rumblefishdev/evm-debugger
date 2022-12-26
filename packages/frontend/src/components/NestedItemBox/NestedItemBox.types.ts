import type { BoxProps } from '@mui/material'

import type { TNestedTreeMapItem } from '../../types'

// import type { TParsedNestedTraceLog } from '../../evm-imported-types/types'

export interface NestedItemBoxProps extends BoxProps {
  item: TNestedTreeMapItem
}
