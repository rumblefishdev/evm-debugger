import type { ContainerProps } from '@mui/material'
import type React from 'react'

const prefix = 'Section'
export interface SectionProps extends ContainerProps {
  width?: 'full' | 'normal' | 'small'
  mobilePadding?: boolean
  positionRelativeOn?: boolean
  // eslint-disable-next-line @typescript-eslint/naming-convention
  backgroundColor?: string
  position?: 'static'
}

export const sectionClasses = {
  small: `${prefix}-small`,
  normal: `${prefix}-normal`,
  mobilePadding: `${prefix}-mobilePadding`,
  full: `${prefix}-full`,
}