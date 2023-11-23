import type { StackProps } from '@mui/material'

import type { TLogMessageRecord } from '../../../store/analyzer/analyzer.types'

export interface LoggerProps extends StackProps {
  messages: TLogMessageRecord[]
}
