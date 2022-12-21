import { Accordion, AccordionDetails, Chip, Tooltip } from '@mui/material'
import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { isStructLogActive, loadActiveStructlog, updateStackSelectionStatus } from '../../store/activeStructlog/activeStructlog.slice'
import { useTypedSelector } from '../../store/storeHooks'

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

export const StructLogItem = ({ structLog, onClick, ...props }: StructLogItemProps) => {
  const dispatch = useDispatch()
  const { pc, op, args, index, description, gasCost } = structLog

  const isActive = useTypedSelector((state) => isStructLogActive(state.activeStructlog, index))

  const counter = useMemo(() => {
    const defaultString = '00000000'
    const hexValue = pc.toString(16)
    return defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue
  }, [])

  const handleOnClick = () => {
    dispatch(loadActiveStructlog(isActive ? null : structLog))
  }

  const handleStackSelection = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, value: string) => {
    dispatch(updateStackSelectionStatus(value))
    event.stopPropagation()
    event.preventDefault()
  }

  const activeStyle: React.CSSProperties = isActive ? { background: 'rgba(0, 0, 0, 0.04)' } : {}

  return (
    <Accordion expanded={isActive} TransitionProps={{ unmountOnExit: true }}>
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
