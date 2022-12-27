import type { ICallTypeTraceLog, ICreateTypeTraceLog } from '@evm-debuger/types'
import type { CardProps } from '@mui/material'

export interface BlockSummaryProps extends CardProps {}
export interface CallBlockSummaryProps extends BlockSummaryProps {
  item: ICallTypeTraceLog
}
export interface CreateBlockSummaryProps extends BlockSummaryProps {
  item: ICreateTypeTraceLog
}
