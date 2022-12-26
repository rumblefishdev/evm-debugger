import type { BoxProps } from '@mui/material'

import type { TDimmensions, TIntrinsicLog } from '../../types'

export interface IntrinsicItemBoxProps extends BoxProps {
  item: TIntrinsicLog & TDimmensions
}
