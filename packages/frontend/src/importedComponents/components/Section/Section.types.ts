import type { ContainerProps } from '@mui/material'
import type { RefObject } from 'react'

const prefix = 'Section'
export interface SectionProps extends ContainerProps {
  width?: 'full' | 'normal' | 'small'
  height?: 'autoHeight' | 'fullHeight'
  mobilePadding?: boolean
  positionRelativeOn?: boolean
  backDropFilter?: boolean
  // eslint-disable-next-line @typescript-eslint/naming-convention
  backgroundColor?: string
  position?: 'static'
  heightRef?: RefObject<HTMLDivElement> | null
}

export const sectionClasses = {
  small: `${prefix}-small`,
  normal: `${prefix}-normal`,
  mobilePadding: `${prefix}-mobilePadding`,
  fullHeight: `${prefix}-fullHeight`,
  full: `${prefix}-full`,
  autoHeight: `${prefix}-autoHeight`,
}
