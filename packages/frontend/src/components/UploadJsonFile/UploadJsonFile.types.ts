import type { BoxProps } from '@mui/material'

export interface UploadJsonFileProps extends BoxProps {
  label: string
  onChange: (value: unknown) => void
  onBlur: () => void
  title: string
  buttonLabel?: string
}
