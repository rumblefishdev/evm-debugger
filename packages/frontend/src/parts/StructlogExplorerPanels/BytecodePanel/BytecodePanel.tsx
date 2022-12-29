import React, { useEffect } from 'react'
import ViewportList from 'react-viewport-list'

import { useTypedSelector } from '../../../store/storeHooks'
import { bytecodesSelectors } from '../../../store/bytecodes/bytecodes.slice'
import { StyledDisabledBytecode, StyledHeading, StyledListWrapper, StyledSmallPanel } from '../styles'

import { OpcodeItem } from './OpcodeItem'

export const BytecodePanel = (): JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef(null)

  const activeBlock = useTypedSelector((state) => state.activeBlock)
  const activeStrucLog = useTypedSelector((state) => state.structLogs.activeStructLog)
  const previousActiveStrucLog = React.useRef<typeof activeStrucLog>()
  const currentAddress = activeBlock.address
  const activeBlockBytecode = useTypedSelector((state) => bytecodesSelectors.selectById(state.bytecodes, currentAddress))
  useEffect(() => {
    if (!activeBlockBytecode?.disassembled) return
    if (activeStrucLog && previousActiveStrucLog.current !== activeStrucLog) {
      previousActiveStrucLog.current = activeStrucLog
      const pcFormatted = `0x${activeStrucLog.pc.toString(16)}`
      const index = activeBlockBytecode.disassembled.findIndex((opcode) => opcode.pc === pcFormatted)
      if (index) listRef.current?.scrollToIndex(index)
    }
  }, [activeStrucLog])

  if (!activeBlockBytecode) return null

  console.log(activeBlockBytecode.disassembled)

  return (
    <StyledSmallPanel ref={ref}>
      <StyledHeading>Dissasembled Bytecode</StyledHeading>
      {activeBlockBytecode.disassembled ? (
        <StyledListWrapper>
          <ViewportList ref={listRef} viewportRef={ref} items={activeBlockBytecode.disassembled} withCache={true}>
            {(item) => {
              return <OpcodeItem key={item.pc} opcode={item}></OpcodeItem>
            }}
          </ViewportList>
        </StyledListWrapper>
      ) : (
        <StyledDisabledBytecode>Bytecode is not available for this block. Please try again later.</StyledDisabledBytecode>
      )}
    </StyledSmallPanel>
  )
}
