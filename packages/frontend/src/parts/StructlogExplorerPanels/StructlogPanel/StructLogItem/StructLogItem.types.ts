import type { StackProps } from '@mui/material'

import type { IExtendedStructLog } from '../../../../types'

export interface StructLogItemProps extends StackProps {
  structLog: IExtendedStructLog
}
