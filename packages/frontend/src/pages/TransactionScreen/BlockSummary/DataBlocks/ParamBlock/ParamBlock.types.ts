import type { AccordionProps } from '@mui/material'

type TItem = {
  name: string
  value: string | string[] | TItem[]
  type: string
}

export interface ParamBlockProps extends Omit<AccordionProps, 'children'> {
  items: TItem[]
}
