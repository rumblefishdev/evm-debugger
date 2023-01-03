import type { CardProps } from '@mui/material'

import type { TBlockCallSpecificData, TBlockCreateSpecificData, TBlockDefaultData } from '../../../store/activeBlock/activeBlock.types'

export interface BlockSummaryProps extends CardProps {}
export interface CallBlockSummaryProps extends BlockSummaryProps {
  data: TBlockCallSpecificData
}
export interface CreateBlockSummaryProps extends BlockSummaryProps {
  data: TBlockCreateSpecificData
}

export interface DefaultBlockSummaryProps extends BlockSummaryProps {
  data: TBlockDefaultData
}
