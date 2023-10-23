import React from 'react'
import type { VirtuosoHandle } from 'react-virtuoso'

import { StyledButton, StyledHeading, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { convertOpcodeToName } from '../../../../helpers/opcodesDictionary'
import { VirtualizedList } from '../../../../components/VirtualizedList/VirtualizedList'

import type { BytecodePanelComponentProps } from './BytecodePanel.types'

export const BytecodePanelComponent = React.forwardRef<VirtuosoHandle, BytecodePanelComponentProps>(
  ({ currentElementIndex, dissasembledBytecode, isAbleToDisplaySourceCodePanel, toggleSourceCodePanel }, ref) => {
    return (
      <StyledSmallPanel>
        <StyledHeading>
          Disassembled Bytecode
          <StyledButton
            variant="text"
            onClick={toggleSourceCodePanel}
            disabled={!isAbleToDisplaySourceCodePanel}
          >
            View source
          </StyledButton>
        </StyledHeading>
        <VirtualizedList
          ref={ref}
          items={dissasembledBytecode}
        >
          {(listIndex, data) => {
            const { opcode, operand, pc } = data
            const isActive = currentElementIndex === listIndex
            return (
              <ExplorerListRow
                id={`bytecodeItem_${listIndex}`}
                key={pc}
                chipValue={operand}
                isActive={isActive}
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
