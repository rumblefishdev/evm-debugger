import { Chip, Tooltip } from '@mui/material'
import React, { useEffect, useMemo, useRef } from 'react'

import { convertPcToCounter } from '../../helpers/helpers'
import { opcodesDictionary } from '../../helpers/opcodesDictionary'

import type { ExplorerListRowProps } from './ExplorerListRow.types'
import { StyledChip, StyledChipText, StyledCounter, StyledOpcodeDescriptionIcon, StyledStack, StyledType } from './styles'

export const ExplorerListRow = ({ chipValue, pc, opCode, isActive, onClick, ...props }: ExplorerListRowProps) => {
  const itemRef = useRef<HTMLDivElement>(null)

  const description = useMemo(() => {
    return opcodesDictionary[opCode].description ?? 'No description'
  }, [])

  const counter = useMemo(() => {
    return convertPcToCounter(pc)
  }, [])

  useEffect(() => {
    if (isActive && itemRef.current) itemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [isActive, itemRef])

  const activeStyle: React.CSSProperties = isActive ? { background: 'rgba(0, 0, 0, 0.12)' } : {}

  return (
    <StyledStack {...props} ref={itemRef} onClick={onClick} sx={activeStyle}>
      <StyledCounter>{counter}</StyledCounter>
      <StyledType>
        {opCode}
        <Tooltip title={description}>
          <StyledOpcodeDescriptionIcon />
        </Tooltip>
      </StyledType>
      {chipValue ? (
        <Tooltip title={chipValue}>
          <StyledChip>
            <StyledChipText>{chipValue}</StyledChipText>
          </StyledChip>
        </Tooltip>
      ) : null}
    </StyledStack>
  )
}