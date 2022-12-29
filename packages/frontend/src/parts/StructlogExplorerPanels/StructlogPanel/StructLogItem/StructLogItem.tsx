import { Chip, Tooltip } from '@mui/material'
import React, { useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { isStructLogActive, loadActiveStructLog, updateStackSelectionStatus } from '../../../../store/structlogs/structlogs.slice'
import { useTypedSelector } from '../../../../store/storeHooks'
import { convertPcToCounter } from '../../../../helpers/helpers'
import { StyledCounter, StyledOpcodeDescriptionIcon, StyledType } from '../../styles'

import type { StructLogItemProps } from './StructLogItem.types'
import { StyledStack } from './styles'

export const StructLogItem = ({ structLog, ...props }: StructLogItemProps) => {
  const dispatch = useDispatch()
  const { pc, op, index, description, gasCost } = structLog

  const itemRef = useRef<HTMLDivElement>(null)

  const isActive = useTypedSelector((state) => isStructLogActive(state, index))

  useEffect(() => {
    if (isActive && itemRef.current) itemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [isActive, itemRef])

  const counter = useMemo(() => {
    return convertPcToCounter(pc)
  }, [])

  const handleStackSelection = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, value: string) => {
    dispatch(updateStackSelectionStatus(value))
    event.stopPropagation()
    event.preventDefault()
  }

  const handleOnClick = () => {
    dispatch(loadActiveStructLog(isActive ? null : structLog))
  }
  const activeStyle: React.CSSProperties = isActive ? { background: 'rgba(0, 0, 0, 0.12)' } : {}

  return (
    <StyledStack {...props} ref={itemRef} onClick={handleOnClick} sx={activeStyle}>
      <StyledCounter>{counter}</StyledCounter>
      <StyledType>
        {op}
        <Tooltip title={description}>
          <StyledOpcodeDescriptionIcon />
        </Tooltip>
      </StyledType>
      <Chip label={`gasCost: ${gasCost}`} />
    </StyledStack>
  )
}
