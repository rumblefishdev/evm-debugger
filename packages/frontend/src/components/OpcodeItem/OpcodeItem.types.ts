import type { StackProps } from '@mui/material'
import type { TOpcodeDisassemled } from '../../types'

export interface OpcodeItemProps extends StackProps {
  opcode: TOpcodeDisassemled
}