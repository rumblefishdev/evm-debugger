import React, { useCallback, useState } from 'react'

import { loadActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import { useTypedDispatch } from '../../store/storeHooks'
import { ItemBox } from '../ItemBox'

import type { NestedItemBoxProps } from './NestedItemBox.types'
import { StyledBox, StyledInfoPanel, StyledNestedItemsBox } from './styles'

export const NestedItemBox = ({ item, ...props }: NestedItemBoxProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useTypedDispatch()

  const hovered = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsHovered(true)
    event.stopPropagation()
  }, [])

  const notHovered = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsHovered(false)
    event.stopPropagation()
  }, [])

  const setActiveBlock = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(loadActiveBlock(item))
    event.stopPropagation()
  }, [])

  const { nestedItems, type, stackTrace, width, height, x, y, index } = item

  const styleDimension: React.CSSProperties = { width, height }

  const hoverStyle: React.CSSProperties = isHovered
    ? { background: 'rgba(255, 129, 120 , .4)' }
    : { background: 'rgba(255, 129, 120 , .1)' }

  return (
    <StyledBox
      {...props}
      sx={{ ...styleDimension, ...hoverStyle, top: y, left: x, ...props.sx, zIndex: 0 }}
      onMouseOver={hovered}
      onMouseOut={notHovered}
      onClick={setActiveBlock}
    >
      <StyledInfoPanel>
        {type}__{stackTrace.join('__')}{' '}
      </StyledInfoPanel>
      <StyledNestedItemsBox sx={{ ...styleDimension, zIndex: index }}>
        {nestedItems.map((nestedItem, blockIndex) =>
          nestedItem.nestedItems.length > 0 ? (
            <NestedItemBox key={blockIndex} item={nestedItem} />
          ) : (
            <ItemBox key={blockIndex} item={nestedItem} />
          )
        )}
      </StyledNestedItemsBox>
    </StyledBox>
  )
}
