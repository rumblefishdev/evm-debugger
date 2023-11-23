import type { StackProps } from '@mui/material'

export interface SelectMenuProps extends StackProps {
  elements: string[]
  selectedElement: string
  selectionCallback: (element: string) => void
}
