import type { DialogProps } from '@mui/material'

export interface RawDataDisplayerProps extends DialogProps {
  data: string
  title: string
  address: string
  description?: string
}
