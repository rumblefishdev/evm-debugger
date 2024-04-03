import type { TContractFunctionInputParameter } from '@evm-debuger/types'
import type { TooltipProps } from '@mui/material'

export type TFunctionInputParameterProps = {
  parameter: TContractFunctionInputParameter
  color: string
}

export type TFunctionInputParameterComponentProps = Partial<TooltipProps> & {
  value: TContractFunctionInputParameter['value']
  name: TContractFunctionInputParameter['name']
  type: TContractFunctionInputParameter['type']
  shortValue: string
  isTooltipOpen: boolean
  color: string
  handleTooltipOpen: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  handleTooltipClose: () => void
}
