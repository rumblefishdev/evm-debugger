import { Tooltip } from '@mui/material'
import React, { useRef } from 'react'

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

  return (
    <StyledStack ref={itemRef} {...props} direction="row">
      <StyledCounter>{opcode.pc}</StyledCounter>
      <StyledType>
        {currentOpcode.name}
        <Tooltip title={currentOpcode.description}>
          <StyledOpcodeDescriptionIcon />
        </Tooltip>
      </StyledType>
      <StyledType>{opcode.operand}</StyledType>
    </StyledStack>
  )
}
