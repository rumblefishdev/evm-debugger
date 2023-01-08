import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'

export interface IManualUploadFormData {
  txInfo: TTransactionInfo
  structLogs: { structLogs: IStructLog[] }
}
