import React from 'react'

import type { OpcodeItemProps } from './OpcodeItem.types'
import {
  StyledRecord,
  StyledRecordIndex,
} from './styles'

export const OpcodeItem = React.forwardRef(({ opcode, ref, ...props}: OpcodeItemProps) => {
  
  return (
    <StyledRecord direction="row" ref={ref} {...props}>
      <StyledRecordIndex>{opcode.opcode}</StyledRecordIndex>
      <StyledRecordIndex>{opcode.name}</StyledRecordIndex>
      <StyledRecordIndex>{opcode.operand}</StyledRecordIndex>
    </StyledRecord>
  )
})