import React from 'react'
import type { VirtuosoHandle } from 'react-virtuoso'

import { StyledHeading, StyledHeadingWrapper, StyledPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { VirtualizedList } from '../../../../components/VirtualizedList/VirtualizedList'

import type { BytecodePanelComponentProps } from './BytecodePanel.types'

export const BytecodePanelComponent = React.forwardRef<VirtuosoHandle, BytecodePanelComponentProps>(
  ({ currentElementIndex, dissasembledBytecode }, ref) => {
    return (
      <StyledPanel>
        <StyledHeadingWrapper>
          <StyledHeading sx={{ fontSize: 22 }}>Disassembled Bytecode</StyledHeading>
        </StyledHeadingWrapper>
        <VirtualizedList
          ref={ref}
          items={dissasembledBytecode}
        >
          {(listIndex, data) => {
            const { opcode, pc, value } = data
            return (
              <ExplorerListRow
                key={pc}
                chipValue={value}
                isActive={currentElementIndex === listIndex}
                opCode={opcode}
                pc={pc}
              />
            )
          }}
        </VirtualizedList>
      </StyledPanel>
    )
  },
)
