import type { StackProps } from '@mui/material'
import type { ReactElement } from 'react'

import type { RawDataDisplayerProps } from '../RawDataDisplayer/RawDataDisplayer.types'

export interface ManagerItemProps extends StackProps {
  name: string
  value: string
  isFound: boolean
  address?: string
  updateItem: (id: string, value: string) => void
  displayer?: (props: RawDataDisplayerProps) => ReactElement
}
