import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'

import type { TMainTraceLogsWithId } from './store/traceLogs/traceLogs.types'

export type TDimensions = {
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

export type TTreeMapItem = TIntrinsicLog | TMainTraceLogsWithId

export type TTreeMapData = {
  item: TMainTraceLogsWithId | TIntrinsicLog
  dimensions: TDimensions
  nestedItems: TTreeMapData[]
}

export type TTreeMapItemWithoutNested = Omit<TTreeMapData, 'nestedItems'>

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
  creationBytecode?: string
}
export type TSourceCodes = { address: string; sourceCode: string | null }
export type TContractNames = { address: string; contractName: string | null }

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

export type TParsedArg = {
  value: string | string[] | TParsedArg[]
  type: string
  name: string
}

export type TParsedEventLogBody = {
  signature: string
  parsedArgs: TParsedArg[]
  name: string
}

export type TParsedEventLog = TParsedEventLogBody | null
