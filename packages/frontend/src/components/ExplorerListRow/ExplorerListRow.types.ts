import type { StackProps } from '@mui/material'

export interface ExplorerListRowProps extends StackProps {
  pc: number | string
  opCode: string
  chipValue: string
  isActive: boolean
}
