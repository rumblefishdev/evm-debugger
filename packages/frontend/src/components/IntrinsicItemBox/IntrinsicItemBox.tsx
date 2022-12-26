import React from 'react'

import { StyledBox } from './styles'
import type { IntrinsicItemBoxProps } from './IntrinsicItemBox.types'

export const IntrinsicItemBox = ({ item, ...props }: IntrinsicItemBoxProps) => {
  const { width, height, x, y } = item

  const styleDimension: React.CSSProperties = {
    width,
    top: y,
    left: x,
    height,
  }

  return <StyledBox {...props} sx={styleDimension}></StyledBox>
}
