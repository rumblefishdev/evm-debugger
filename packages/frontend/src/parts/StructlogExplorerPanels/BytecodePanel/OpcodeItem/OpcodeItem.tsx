import { Tooltip } from '@mui/material'
import React, { useMemo, useRef } from 'react'

import { INVALID_OPCODE, remappedOpcodesDict } from '../../../../helpers/opcodesDictionary'
import { convertPcToCounter } from '../../../../helpers/helpers'
import { StyledCounter, StyledOpcodeDescriptionIcon, StyledType } from '../../styles'

import type { OpcodeItemProps } from './OpcodeItem.types'
import { StyledStack } from './styles'

export const OpcodeItem = ({ opcode, ...props }: OpcodeItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const currentOpcode = remappedOpcodesDict[opcode.opcode] ?? INVALID_OPCODE

  const counter = useMemo(() => {
    return convertPcToCounter(opcode.pc)
  }, [])

  return (
    <StyledStack ref={itemRef} {...props} direction="row">
      <StyledCounter>{counter}</StyledCounter>
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
