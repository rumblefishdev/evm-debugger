import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'
import type { StackProps } from '@mui/material'

export interface ManualProps extends StackProps {}

export interface IManualUploadFormData {
  txInfo: TTransactionInfo
  structLogs: { structLogs: IStructLog[] }
}
