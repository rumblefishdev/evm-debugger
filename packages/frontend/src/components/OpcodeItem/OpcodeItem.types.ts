import { TAllOpCodes } from '@evm-debuger/types'
import type { StackProps } from '@mui/material'

export interface OpcodeItemProps extends StackProps {
  opcode: IOpCodeDisassemled
}

export interface IOpCodeDisassemled {
  opcode: number
  name: TAllOpCodes
  description: string
  operand: number
  pc: number
}