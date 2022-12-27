import type { BoxProps } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'

import type { TDimmensions, TIntrinsicLog } from '../../types'

export interface IntrinsicItemBoxProps extends BoxProps {
  item: TIntrinsicLog & TDimmensions
  parentHoverHandler?: Dispatch<SetStateAction<boolean>>
}
