import type { IStructLog, TTransactionInfo, TMainTraceLogs } from '@evm-debuger/types'

export type TMainTraceLogsWithId = TMainTraceLogs & {
  id: string
}

export type TParsedExtendedTraceLog = {
  traceLog: TMainTraceLogsWithId
  width: number
  height: number
  x: number
  y: number
}

export type TDimmensions = {
  width: number
  height: number
  x: number
  y: number
}

export type TIntrinsicLog = {
  owningLog: {
    type: string
    stackTrace: number[]
  }
  gasCost: number
  id: string
}

export type TNestedTraceLogs = TMainTraceLogsWithId & {
  nestedItems: (TNestedTraceLogs | TIntrinsicLog)[]
}

export type TNestedTreeMapItem = TMainTraceLogsWithId &
  TDimmensions & {
    nestedItems: (TNestedTreeMapItem | (TIntrinsicLog & TDimmensions))[]
  }

export type TOpcodeDisassemled = {
  opcode: number
  operand: string
  pc: string
}

export type TBytecodes = {
  address: string
  bytecode: string | null
  error: string | null
  disassembled: TOpcodeDisassemled[] | null
}
export type TSourceCodes = { address: string; sourceCode: string | null }

export type TRawTxData = {
  txHash: string
  transactionInfo: TTransactionInfo
  contractAddresses: string[]
}

export type TExtendedStack = { value: string; isSelected: boolean }[]

export interface IExtendedStructLog extends Omit<IStructLog, 'stack'> {
  description: string
  args: {
    name: string
    value: string
  }[]
  index: number
  stack: TExtendedStack
}
