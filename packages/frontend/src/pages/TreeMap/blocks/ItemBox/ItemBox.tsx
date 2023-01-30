import React, { useCallback, useState } from 'react'

import { loadActiveBlock } from '../../../../store/activeBlock/activeBlock.slice'
import {
  useTypedDispatch,
  useTypedSelector,
} from '../../../../store/storeHooks'
import { TreemapTooltip } from '../../TreemapTooltip'

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
      if (parentHoverHandler) parentHoverHandler(true)
      event.stopPropagation()
    },
    [parentHoverHandler],
  )

  const notHovered = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsHovered(false)
      if (parentHoverHandler) parentHoverHandler(false)
      event.stopPropagation()
    },
    [parentHoverHandler],
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
    getActiveBlock?.id === id
      ? {
          border: '1px solid rgba(249, 39, 127, 1)',
          background: 'rgba(249, 39, 127, 0.5)',
        }
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
