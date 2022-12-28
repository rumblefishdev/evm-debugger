import React, { useCallback, useState } from 'react'

import { loadActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { TreemapTooltip } from '../TreemapTooltip'

import type { ItemBoxProps } from './ItemBox.types'
import { StyledStack } from './styles'

export const ItemBox = ({
  treeMapItem,
  parentHoverHandler,
  ...props
}: ItemBoxProps) => {
  const { type, stackTrace, gasCost, index, id } = treeMapItem.item

  const { width, height, x, y } = treeMapItem.dimmensions

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
    dispatch(loadActiveBlock(treeMapItem.item))

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
    getActiveBlock?.id === id ? { background: 'rgba(80, 180, 242 , .4)' } : {}

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
