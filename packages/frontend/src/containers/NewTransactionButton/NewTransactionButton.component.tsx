import React from 'react'
import { Add } from '@mui/icons-material'

import { Button } from '../../components/Button'

import type { NewTransactionButtonProps } from './NewTransactionButton.types'

export const NewTransactionButtonComponent: React.FC<NewTransactionButtonProps> = (props) => {
  return (
    <Button
      variant="text"
      size="small"
      startIcon={<Add />}
      {...props}
    >
      New Transaction
    </Button>
  )
}
