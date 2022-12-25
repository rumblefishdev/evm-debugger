import { Tooltip } from '@mui/material'
import React, { useMemo, useRef } from 'react'

import { convertNrToHexString } from '../../helpers/helpers'
import {
  StyledCounter,
  StyledOpcodeDescriptionIcon,
  StyledType,
} from '../StructLogItem/styles'
import {
  INVALID_OPCODE,
  remappedOpcodesDict,
} from '../../helpers/opcodesDictionary'

import type { OpcodeItemProps } from './OpcodeItem.types'
import { StyledStack } from './styles'

export const OpcodeItem = ({ opcode, ...props }: OpcodeItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const currentOpcode = remappedOpcodesDict[opcode.opcode] ?? INVALID_OPCODE
  const counter = useMemo(() => {
    return convertNrToHexString(opcode.pc)
  }, [opcode.pc])
  const operand = useMemo(() => {
    return convertNrToHexString(opcode.operand)
  }, [opcode.operand])

  return (
    <StyledStack id={`pc-${counter}`} ref={itemRef} {...props} direction="row">
      <StyledCounter>{counter}</StyledCounter>
      <StyledType>
        {currentOpcode.name}
        <Tooltip title={currentOpcode.description}>
          <StyledOpcodeDescriptionIcon />
        </Tooltip>
      </StyledType>
      <StyledType>{operand}</StyledType>
    </StyledStack>
  )
}
