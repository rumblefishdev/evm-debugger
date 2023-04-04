import React, { useEffect } from 'react'
import ViewportList from 'react-viewport-list'
import type { ViewportListRef } from 'react-viewport-list'
import { ethers } from 'ethers'

import { useTypedSelector } from '../../../../store/storeHooks'
import { bytecodesSelectors } from '../../../../store/bytecodes/bytecodes.slice'
import { StyledHeading, StyledListWrapper, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import { convertOpcodeToName } from '../../../../helpers/opcodesDictionary'

import { StyledDisabledBytecode, StyledButton } from './styles'
import { SourceCodeDebugger } from './SourceCodeDebugger'

export const BytecodePanel = (): JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<ViewportListRef>(null)

  const [isSourceView, setSourceView] = React.useState(false)
  const toggleSourceView = () => setSourceView((prev) => !prev)

  const activeBlock = useTypedSelector((state) => state.activeBlock)
  const sourceCode = useTypedSelector(
    (state) => state.sourceCodes.entities[activeBlock.address],
  )?.sourceCode
  const activeStrucLog = useTypedSelector(
    (state) => state.structLogs.activeStructLog,
  )
  const currentAddress = activeBlock.address
  const activeBlockBytecode = useTypedSelector((state) =>
    bytecodesSelectors.selectById(state.bytecodes, currentAddress),
  )

  useEffect(() => {
    if (!activeBlockBytecode?.disassembled) return
    if (activeStrucLog) {
      const pcFormatted = `0x${activeStrucLog.pc.toString(16)}`
      const index = activeBlockBytecode.disassembled.findIndex(
        (opcode) => opcode.pc === pcFormatted,
      )
      if (index) listRef.current?.scrollToIndex(index)
    }
  }, [activeStrucLog, activeBlockBytecode.disassembled])

  if (!activeBlockBytecode?.disassembled)
    return (
      <StyledSmallPanel>
        <StyledDisabledBytecode>
          Bytecode is not available for this Item. Please try again later.
        </StyledDisabledBytecode>
      </StyledSmallPanel>
    )

  return (
    <StyledSmallPanel>
      <StyledHeading>
        {isSourceView ? 'Source Code' : 'Disassembled Bytecode'}
        {sourceCode || isSourceView ? (
          <StyledButton
            variant="text"
            onClick={toggleSourceView}
            key={isSourceView ? 'byte' : 'source'}
          >
            View {isSourceView ? 'bytecode' : 'source'}
          </StyledButton>
        ) : null}
      </StyledHeading>
      {isSourceView ? (
        <SourceCodeDebugger source={sourceCode} />
      ) : (
        <StyledListWrapper ref={ref}>
          <ViewportList
            ref={listRef}
            viewportRef={ref}
            items={activeBlockBytecode.disassembled}
            withCache={true}
          >
            {(item) => {
              const { opcode, operand, pc } = item
              const isActive =
                activeStrucLog?.pc === ethers.BigNumber.from(pc).toNumber()
              return (
                <ExplorerListRow
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
      )}
    </StyledSmallPanel>
  )
}
