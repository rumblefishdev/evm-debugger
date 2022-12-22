import type { IStructLog, TAllOpCodes} from '@evm-debuger/types';
import type { BoxProps } from '@mui/material';

export interface BytecodeInfoCardProps extends BoxProps {
    bytecode: IStructLog
}

export interface IOpCodeDisassemled {
    opcode: number
    name: TAllOpCodes
    operandSize: number
    pops: number
    pushes: number
    fee: number
    description: string
    operand: number
    pc: number
  }