import { Typography } from '@mui/material'
import React from 'react'

import { loadActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import { useTypedDispatch } from '../../store/storeHooks'

import type { ItemBoxProps } from './ItemBox.types'
import { StyledStack } from './styles'

export const ItemBox = ({ item, ...props }: ItemBoxProps) => {
  const {
    traceLog: { type, stackTrace, gasCost, index },
    width,
    height,
    x,
    y,
  } = item

  const dispatch = useTypedDispatch()

  const setActiveBlock = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    dispatch(loadActiveBlock(item.traceLog))
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
    <StyledStack {...props} sx={styleDimension} onClick={setActiveBlock}>
      <Typography>
        {type}__{stackTrace?.join('__')}
      </Typography>
      <Typography> {gasCost}</Typography>
    </StyledStack>
  )
}
