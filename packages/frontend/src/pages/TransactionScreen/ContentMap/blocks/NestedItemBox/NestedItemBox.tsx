import React, { useCallback, useState } from 'react'

import { useTypedDispatch, useTypedSelector } from '../../../../../store/storeHooks'
import type { TTreeMapData } from '../../../../../types'
import { IntrinsicItemBox } from '../IntrinsicItemBox'
import { ItemBox } from '../ItemBox'
import { TreemapTooltip } from '../../TreemapTooltip'
import { activeBlockActions } from '../../../../../store/activeBlock/activeBlock.slice'

import type { NestedItemBoxProps } from './NestedItemBox.types'
import { StyledBox, StyledNestedItemsBox } from './styles'

export const NestedItemBox = ({ treeMapItem, ...props }: NestedItemBoxProps) => {
  const [isTooltipActive, setIsTooltipActive] = useState(false)
  const dispatch = useTypedDispatch()

  const getActiveBlock = useTypedSelector((state) => state.activeBlock)

  const hovered = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsTooltipActive(true)
    event.stopPropagation()
  }, [])

  const notHovered = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsTooltipActive(false)
    event.stopPropagation()
  }, [])

  const setActiveBlock = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      dispatch(activeBlockActions.loadActiveBlock(treeMapItem.item))
      event.stopPropagation()
    },
    [treeMapItem.item, dispatch],
  )

  const renderContent = (element: TTreeMapData) => {
    if ('owningLog' in element.item)
      return (
        <IntrinsicItemBox
          treeMapItem={{ ...element, item: element.item }}
          key={element.item.id}
        />
      )

    if (element.nestedItems.length > 0)
      return (
        <NestedItemBox
          treeMapItem={{ ...element, item: element.item }}
          key={element.item.id}
        />
      )

    return (
      <ItemBox
        treeMapItem={{ ...element, item: element.item }}
        key={element.item.id}
      />
    )
  }

  const { gasCost, index, op, stackTrace, id } = treeMapItem.item

  const { width, height, x, y } = treeMapItem.dimensions

  const styleDimension: React.CSSProperties = { width, height }

  const activeStyle =
    getActiveBlock?.id === id
      ? {
          border: '1px solid rgba(249, 39, 127, 1)',
          background: 'rgba(249, 39, 127, 0.5)',
        }
      : {}

  return (
    <TreemapTooltip
      type={op}
      stackTrace={stackTrace}
      gasCost={gasCost}
      open={isTooltipActive}
    >
      <StyledBox
        {...props}
        sx={{
          ...styleDimension,
          top: y,
          left: x,
          ...props.sx,
          ...activeStyle,
        }}
        onMouseOver={hovered}
        onMouseOut={notHovered}
        onClick={setActiveBlock}
      >
        <StyledNestedItemsBox sx={{ ...styleDimension, zIndex: index }}>
          {treeMapItem.nestedItems.map((nestedItem) => renderContent(nestedItem))}
        </StyledNestedItemsBox>
      </StyledBox>
    </TreemapTooltip>
  )
}
