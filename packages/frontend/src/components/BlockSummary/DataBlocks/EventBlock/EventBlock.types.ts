import type { StackProps } from '@mui/material'

import type { TParsedEventLog } from '../../../../types'

export interface EventBlockProps extends StackProps {
  eventLogs: TParsedEventLog[]
}
