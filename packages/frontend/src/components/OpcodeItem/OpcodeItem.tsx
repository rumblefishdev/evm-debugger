import { Tooltip } from '@mui/material'
import React from 'react'
import { convertNrToHexString } from '../../helpers/helpers'

import type { OpcodeItemProps } from './OpcodeItem.types'
import { StyledOpcodeDescriptionIcon } from '../StructLogItem/styles'
import {
  StyledRecord,
  StyledRecordIndex,
} from './styles'
import { INVALID_OPCODE, remappedOpcodesDict } from '../../helpers/opcodesDictionary'

export const OpcodeItem = ({ opcode,  ...props}: OpcodeItemProps) => {
  const currentOpcode = remappedOpcodesDict[opcode.opcode] ?? INVALID_OPCODE

  return (
    <StyledRecord direction="row" {...props}>
      <StyledRecordIndex>{convertNrToHexString(opcode.pc)}</StyledRecordIndex>
      <StyledRecordIndex>{currentOpcode.name}
        <Tooltip title={currentOpcode.description}>
          <StyledOpcodeDescriptionIcon />
        </Tooltip>
        </StyledRecordIndex>
      <StyledRecordIndex>{opcode.operand}</StyledRecordIndex>
    </StyledRecord>
  )
}