import type { StackProps } from '@mui/material'

import type { TParsedExtendedTraceLog } from '../../types'

export interface ItemBoxProps extends StackProps {
  item: TParsedExtendedTraceLog
}
