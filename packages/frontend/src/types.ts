import type { ICallTypeTraceLog, ICreateTypeTraceLog, IStructLog, TTransactionInfo } from '@evm-debuger/types'

export type TTraceLog = ICallTypeTraceLog | ICreateTypeTraceLog

export type TParsedExtendedTraceLog = TTraceLog & {
  width: number
  height: number
  x: number
  y: number
  nestedItems: TParsedExtendedTraceLog[]
}

export type TBytecodes = { address: string; bytecode: string | null }
export type TSourceCodes = { address: string; sourceCode: string | null }

export type TRawTxData = {
  txHash: string
  transactionInfo: TTransactionInfo
  structLogs: IStructLog[]
  contractAddresses: string[]
}
