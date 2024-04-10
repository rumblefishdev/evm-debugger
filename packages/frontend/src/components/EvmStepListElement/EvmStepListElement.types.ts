import type { StackProps } from '@mui/material'

export interface EvmStepListElementProps extends StackProps {
  pc: number | string
  opCode: string
  baseGasCost: number
  dynamicGasCost: number
  isActive: boolean
  pushValue?: string
}
