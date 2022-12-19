import type { StackProps } from '@mui/material'

export interface StructLogItemProps extends StackProps {
  counter: number
  type: string
  arguments?: string[]
}
