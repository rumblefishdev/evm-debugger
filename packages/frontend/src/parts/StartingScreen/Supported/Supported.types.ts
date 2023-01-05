import type { StackProps } from '@mui/material'

export interface SupportedProps extends StackProps {}
export interface IFormData {
  transactionHash: string
  chainId: number
}
