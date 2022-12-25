import type {
  ICallTypeTraceLog,
  ICreateTypeTraceLog,
  IStructLog,
  TTransactionInfo,
} from '@evm-debuger/types'

export type TTraceLog = ICallTypeTraceLog | ICreateTypeTraceLog

export type TParsedExtendedTraceLog = TTraceLog & {
  width: number
  height: number
  x: number
  y: number
  nestedItems: TParsedExtendedTraceLog[]
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
