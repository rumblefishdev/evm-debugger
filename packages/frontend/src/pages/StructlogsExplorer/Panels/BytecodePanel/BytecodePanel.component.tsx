import React from 'react'
import ViewportList from 'react-viewport-list'
import { ethers } from 'ethers'

import { StyledButton, StyledHeading, StyledListWrapper, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { convertOpcodeToName } from '../../../../helpers/opcodesDictionary'

import type { BytecodePanelComponentProps } from './BytecodePanel.types'

export const BytecodePanelComponent = React.forwardRef(
  (props: BytecodePanelComponentProps, ref: React.MutableRefObject<HTMLDivElement>) => {
    const { activeStructlogPc, dissasembledBytecode, isSourceCodeAvailable, toggleSourceCodePanel } = props

    return (
      <StyledSmallPanel>
        <StyledHeading>
          Disassembled Bytecode
          <StyledButton
            variant="text"
            onClick={toggleSourceCodePanel}
            disabled={!isSourceCodeAvailable}
          >
            View source
          </StyledButton>
        </StyledHeading>
        <StyledListWrapper ref={ref}>
          <ViewportList
            viewportRef={ref}
            items={dissasembledBytecode}
            withCache={true}
          >
            {(item, index) => {
              const { opcode, operand, pc } = item
              const isActive = activeStructlogPc === ethers.BigNumber.from(pc).toNumber()
              return (
                <ExplorerListRow
                  id={`bytecodeItem_${index}`}
                  key={pc}
                  chipValue={operand}
                  isActive={isActive}
                  opCode={convertOpcodeToName(opcode)}
                  pc={pc}
                />
              )
            }}
          </ViewportList>
        </StyledListWrapper>
      </StyledSmallPanel>
    )
  },
)
