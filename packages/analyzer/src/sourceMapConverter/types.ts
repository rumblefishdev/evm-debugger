import type { TSourceMap } from '@evm-debuger/types'

import type { Opcodes } from './opcodes'

export type JsonContent = {
  sourceMaps: Record<string, TSourceMap[]>
  sourceCodes: Record<string, string>
}

export type Source = {
  bytecode: string
  sourceMap: string
  opcodes: string
  sourceCodeRaw: string
  sourceCodeParsed: string
}

export type PayloadContent = {
  address: string
  combinedRawSourceCode: string
  sources: Record<string, Source>
}

export type OpcodeElement = {
  opcode: Opcodes | string
  payload: string
}

export type SourceMapElement = {
  start: number
  length: number
  fileId: number
  jump: string
}

export type ConversionResult = {
  pc: number
  opcode: Opcodes
  fileId: number
  fileLine: number
}

export type Payload = Record<string, PayloadContent>
