import { Tooltip } from '@mui/material'
import React from 'react'
import { convertNrToHexString } from '../../helpers/helpers'

import type { OpcodeItemProps } from './OpcodeItem.types'
import { StyledOpcodeDescriptionIcon } from '../StructLogItem/styles'
import {
  StyledRecord,
  StyledRecordIndex,
} from './styles'

export const OpcodeItem = React.forwardRef(({ opcode, ref, ...props}: OpcodeItemProps) => {
  
  return (
    <StyledRecord direction="row" ref={ref} {...props}>
      <StyledRecordIndex>{convertNrToHexString(opcode.pc)}</StyledRecordIndex>
      <StyledRecordIndex>{opcode.name}
        <Tooltip title={opcode.description}>
          <StyledOpcodeDescriptionIcon />
        </Tooltip>
        </StyledRecordIndex>
      <StyledRecordIndex>{opcode.operand}</StyledRecordIndex>
    </StyledRecord>
  )
})