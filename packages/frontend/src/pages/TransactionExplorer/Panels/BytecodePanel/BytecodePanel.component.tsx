import React from 'react'
import type { VirtuosoHandle } from 'react-virtuoso'

import { StyledHeading, StyledHeadingWrapper, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { convertOpcodeToName } from '../../../../helpers/opcodesDictionary'
import { VirtualizedList } from '../../../../components/VirtualizedList/VirtualizedList'
import { GridLayoutHandler } from '../../../../components/GridLayout'

import type { BytecodePanelComponentProps } from './BytecodePanel.types'

export const BytecodePanelComponent = React.forwardRef<VirtuosoHandle, BytecodePanelComponentProps>(
  ({ currentElementIndex, dissasembledBytecode, inGridLayout }, ref) => {
    return (
      <StyledSmallPanel>
        <StyledHeadingWrapper>
          <StyledHeading sx={{ fontSize: 22 }}>Disassembled Bytecode</StyledHeading>
          <div style={{ flex: 1 }} />
          {inGridLayout && <GridLayoutHandler />}
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
