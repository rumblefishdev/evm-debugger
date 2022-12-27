import React, { useCallback, useState } from 'react'

import { loadActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { TreemapTooltip } from '../TreemapTooltip'

import type { ItemBoxProps } from './ItemBox.types'
import { StyledStack } from './styles'

export const ItemBox = ({
  item,
  parentHoverHandler,
  ...props
}: ItemBoxProps) => {
  const { type, stackTrace, gasCost, width, height, x, y, index, id } = item

  const [isHovered, setIsHovered] = useState(false)

  const getActiveBlock = useTypedSelector((state) => state.activeBlock)

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

  const activeStyle =
    getActiveBlock?.id === id
      ? { border: '4px solid rgba(255, 129, 120 , 1)' }
      : {}

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
        sx={{ ...styleDimension, ...activeStyle }}
        onClick={setActiveBlock}
      ></StyledStack>
    </TreemapTooltip>
  )
}
