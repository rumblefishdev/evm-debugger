import React from 'react'
import type { VirtuosoHandle } from 'react-virtuoso'

import { StyledHeading, StyledHeadingWrapper, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { convertOpcodeToName } from '../../../../helpers/opcodesDictionary'
import { VirtualizedList } from '../../../../components/VirtualizedList/VirtualizedList'

import type { BytecodePanelComponentProps } from './BytecodePanel.types'

export const BytecodePanelComponent = React.forwardRef<VirtuosoHandle, BytecodePanelComponentProps>(
  ({ currentElementIndex, dissasembledBytecode }, ref) => {
    return (
      <StyledSmallPanel>
        <StyledHeadingWrapper>
          <StyledHeading>Disassembled Bytecode</StyledHeading>
        </StyledHeadingWrapper>
        <VirtualizedList
          ref={ref}
          items={dissasembledBytecode}
        >
          {(listIndex, data) => {
            const { opcode, operand, pc } = data
            return (
              <ExplorerListRow
                key={pc}
                chipValue={operand}
                isActive={currentElementIndex === listIndex}
                opCode={convertOpcodeToName(opcode)}
                pc={pc}
              />
            )
          }}
        </VirtualizedList>
      </StyledSmallPanel>
    )
  },
)