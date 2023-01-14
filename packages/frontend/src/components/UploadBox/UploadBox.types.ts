import type { StackProps } from '@mui/material'

export interface UploadStackProps extends StackProps {
  title: string
  uploadInfo: string
  isUploaded: boolean
  isError?: boolean
  errorMessage?: string
  onChange: (value: unknown) => void
  onBlur: () => void
}
