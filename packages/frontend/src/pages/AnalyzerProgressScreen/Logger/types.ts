import type { StackProps } from '@mui/material'

export interface LoggerProps extends StackProps {
  messages: {
    timestamp: Date
    message: string
  }[]
}
