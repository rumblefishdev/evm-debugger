import { IStructLog, TStorage } from '@evm-debuger/types';
import type { BoxProps } from '@mui/material';

export interface BytecodeInfoCardProps extends BoxProps {
    bytecode: IStructLog
    storage: TStorage
}

