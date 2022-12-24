import { Accordion, AccordionDetails, Chip, Tooltip } from '@mui/material'
import React, { useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { isStructLogActive, loadActiveStructLog, updateStackSelectionStatus } from '../../store/structlogs/structlogs.slice'
import { useTypedSelector } from '../../store/storeHooks'
import { convertNrToHexString } from '../../helpers/helpers'

import type { StructLogItemProps } from './StructLogItem.types'
import {
  StyledAcoordionSummary,
  StyledArgName,
  StyledArgsItemWrapper,
  StyledArgsWrapper,
  StyledArgValue,
  StyledCounter,
  StyledOpcodeDescriptionIcon,
  StyledStack,
  StyledType,
} from './styles'

export const StructLogItem = ({ structLog, ...props }: StructLogItemProps) => {
  const dispatch = useDispatch()
  const { pc, op, args, index, description, gasCost } = structLog

  const itemRef = useRef<HTMLDivElement>(null)

  const isActive = useTypedSelector((state) => isStructLogActive(state, index))

  useEffect(() => {
    if (isActive && itemRef.current) itemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [isActive])

  const counter = useMemo(() => {
    return convertNrToHexString(pc)
  }, [])

  const handleOnClick = () => {
    dispatch(loadActiveStructLog(isActive ? null : structLog))
  }

  const handleStackSelection = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, value: string) => {
    dispatch(updateStackSelectionStatus(value))
    event.stopPropagation()
    event.preventDefault()
  }

  const activeStyle: React.CSSProperties = isActive ? { background: 'rgba(0, 0, 0, 0.04)' } : {}

  return (
    <Accordion expanded={isActive} ref={itemRef}>
      <StyledAcoordionSummary onClick={handleOnClick} sx={activeStyle}>
        <StyledStack {...props}>
          <StyledCounter>{counter}</StyledCounter>
          <StyledType>
            {op}
            <Tooltip title={description}>
              <StyledOpcodeDescriptionIcon />
            </Tooltip>
          </StyledType>
          <Chip label={`gasCost: ${gasCost}`} />
        </StyledStack>
      </StyledAcoordionSummary>
      {args.length > 0 ? (
        <AccordionDetails sx={activeStyle}>
          <StyledArgsWrapper>
            {args.map((arg) => {
              return (
                <StyledArgsItemWrapper
                  onMouseOver={(event) => handleStackSelection(event, arg.value)}
                  onMouseOut={(event) => handleStackSelection(event, arg.value)}
                >
                  <StyledArgName>{arg.name}</StyledArgName>
                  <StyledArgValue>{arg.value}</StyledArgValue>
                </StyledArgsItemWrapper>
              )
            })}
          </StyledArgsWrapper>
        </AccordionDetails>
      ) : null}
    </Accordion>
  )
}
