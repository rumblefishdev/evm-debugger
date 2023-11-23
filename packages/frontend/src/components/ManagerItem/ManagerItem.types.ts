import type { StackProps } from '@mui/material'

import type { TransactionContentDialogProps } from '../TransactionContentDialog'

export interface ManagerItemProps extends StackProps {
  name: string
  value: string
  isFound: boolean
  address?: string
  updateItem: (id: string, value: string) => void
  contentType: TransactionContentDialogProps['contentType']
}
