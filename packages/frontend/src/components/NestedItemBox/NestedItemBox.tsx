import React, { useCallback, useState } from 'react'

import { loadActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import { useTypedDispatch } from '../../store/storeHooks'
import type {
  TDimmensions,
  TIntrinsicLog,
  TNestedTreeMapItem,
} from '../../types'
import { IntrinsicItemBox } from '../IntrinsicItemBox'
import { ItemBox } from '../ItemBox'

import type { NestedItemBoxProps } from './NestedItemBox.types'
import { StyledBox, StyledNestedItemsBox } from './styles'

export const NestedItemBox = ({ item, ...props }: NestedItemBoxProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useTypedDispatch()

  const hovered = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsHovered(true)
      event.stopPropagation()
    },
    [],
  )

  const notHovered = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsHovered(false)
      event.stopPropagation()
    },
    [],
  )

  const setActiveBlock = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      dispatch(loadActiveBlock(item))
      event.stopPropagation()
    },
    [],
  )

  const renderContent = (
    element: TNestedTreeMapItem | (TIntrinsicLog & TDimmensions),
  ) => {
    if ('owningLog' in element)
      return <IntrinsicItemBox item={element} key={element.id} />
    if (element.nestedItems.length > 0)
      return <NestedItemBox item={element} key={element.id} />
    return <ItemBox item={element} key={element.id} />
  }

  const { nestedItems, type, stackTrace, width, height, x, y, index } = item

  const styleDimension: React.CSSProperties = { width, height }

  const hoverStyle: React.CSSProperties = isHovered
    ? { background: 'rgba(255, 129, 120 , .4)' }
    : { background: 'rgba(255, 129, 120 , .1)' }

  return (
    <StyledBox
      {...props}
      sx={{
        ...styleDimension,
        ...hoverStyle,
        top: y,
        left: x,
        ...props.sx,
        zIndex: 0,
      }}
      onMouseOver={hovered}
      onMouseOut={notHovered}
      onClick={setActiveBlock}
    >
      <StyledNestedItemsBox sx={{ ...styleDimension, zIndex: index }}>
        {nestedItems.map((nestedItem) => renderContent(nestedItem))}
      </StyledNestedItemsBox>
    </StyledBox>
  )
}
