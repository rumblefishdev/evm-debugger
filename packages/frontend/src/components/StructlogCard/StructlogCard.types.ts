import type { StackProps } from '@mui/material'

import type { IExtendedStructLog } from '../../types'

export interface StructlogCardProps extends StackProps {
  structLogs: IExtendedStructLog[]
}
