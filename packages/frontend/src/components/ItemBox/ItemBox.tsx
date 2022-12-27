import { Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'

import { parseStackTrace } from '../../helpers/helpers'
import { loadActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import { useTypedDispatch } from '../../store/storeHooks'
import { TreemapTooltip } from '../TreemapTooltip'

import type { ItemBoxProps } from './ItemBox.types'
import { StyledStack, TextTest } from './styles'

export const ItemBox = ({
  item,
  parentHoverHandler,
  ...props
}: ItemBoxProps) => {
  const { type, stackTrace, gasCost, width, height, x, y, index, id } = item

  const [isHovered, setIsHovered] = useState(false)

  const hovered = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsHovered(true)
      parentHoverHandler(true)
      event.stopPropagation()
    },
    [],
  )

  const notHovered = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsHovered(false)
      parentHoverHandler(false)
      event.stopPropagation()
    },
    [],
  )

  const dispatch = useTypedDispatch()

  const setActiveBlock = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    dispatch(loadActiveBlock(item))

    event.stopPropagation()
  }

  const styleDimension: React.CSSProperties = {
    zIndex: index,
    width,
    top: y,
    left: x,
    height,
  }

  return (
    <TreemapTooltip
      open={isHovered}
      type={type}
      stackTrace={stackTrace}
      gasCost={gasCost}
      onMouseOver={hovered}
      onMouseOut={notHovered}
    >
      <StyledStack
        {...props}
        sx={styleDimension}
        onClick={setActiveBlock}
      ></StyledStack>
    </TreemapTooltip>
  )
}
