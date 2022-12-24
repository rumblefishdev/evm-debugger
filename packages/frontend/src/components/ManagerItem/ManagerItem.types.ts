import type { StackProps } from '@mui/material'

export interface ManagerItemProps extends StackProps {
  name: string
  value: string
  isFound: boolean
  updateItem: (id: string, value: string) => void
}
