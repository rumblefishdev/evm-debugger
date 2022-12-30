import React, { useCallback, useState } from 'react'

import { TreemapTooltip } from '../TreemapTooltip'

import { StyledBox } from './styles'
import type { IntrinsicItemBoxProps } from './IntrinsicItemBox.types'

export const IntrinsicItemBox = ({
  treeMapItem,
  parentHoverHandler,
  ...props
}: IntrinsicItemBoxProps) => {
  const { gasCost, owningLog } = treeMapItem.item

  const { width, height, x, y } = treeMapItem.dimmensions

  const [isHovered, setIsHovered] = useState(false)

  const hovered = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsHovered(true)
      parentHoverHandler(true)
      event.stopPropagation()
    },
    [parentHoverHandler],
  )

  const notHovered = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsHovered(false)
      parentHoverHandler(false)
      event.stopPropagation()
    },
    [parentHoverHandler],
  )

  const styleDimension: React.CSSProperties = {
    width,
    top: y,
    left: x,
    height,
  }

  return (
    <TreemapTooltip
      open={isHovered}
      gasCost={gasCost}
      stackTrace={owningLog.stackTrace}
      type={`Intrinsic ${owningLog.type} Structlogs`}
      onMouseOver={hovered}
      onMouseOut={notHovered}
    >
      <StyledBox {...props} sx={styleDimension}></StyledBox>
    </TreemapTooltip>
  )
}
