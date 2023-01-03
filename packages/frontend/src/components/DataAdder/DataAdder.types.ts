import type { DialogProps } from '@mui/material'

export interface DataAdderProps extends DialogProps {
  submithandler: (data: string) => void
  title: string
  description?: string
}
