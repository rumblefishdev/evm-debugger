import { Accordion, Tooltip } from '@mui/material'
import React, { useMemo, useRef } from 'react'
import { convertNrToHexString } from '../../helpers/helpers'

import type { OpcodeItemProps } from './OpcodeItem.types'
import { StyledAcoordionSummary, StyledCounter, StyledOpcodeDescriptionIcon, StyledType } from '../StructLogItem/styles'
import { StyledStack } from './styles'
import { INVALID_OPCODE, remappedOpcodesDict } from '../../helpers/opcodesDictionary'


export const OpcodeItem = ({ opcode,  ...props}: OpcodeItemProps) => {
  const currentOpcode = remappedOpcodesDict[opcode.opcode] ?? INVALID_OPCODE
  const itemRef = useRef<HTMLDivElement>(null)
  const counter = useMemo(() => {
    return convertNrToHexString(opcode.pc)
  }, [])
  const operand = useMemo(() => {
    return convertNrToHexString(opcode.operand)
  }, [])

  const activeStyle: React.CSSProperties = itemRef.current ? { background: 'rgba(0, 0, 0, 0.04)' } : {}

  return (
    <Accordion ref={itemRef}>
            <StyledAcoordionSummary sx={activeStyle}>

        <StyledStack {...props} direction="row">
          <StyledCounter>{counter}</StyledCounter>
          <StyledType>
            {currentOpcode.name}
            <Tooltip title={currentOpcode.description}>
              <StyledOpcodeDescriptionIcon />
            </Tooltip>
          </StyledType>
          <StyledType>
            {operand}
          </StyledType>
        </StyledStack>
        </StyledAcoordionSummary>
    </Accordion>
  )
}