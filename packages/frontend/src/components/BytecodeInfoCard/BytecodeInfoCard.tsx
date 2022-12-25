import React, { useEffect } from 'react'
import ViewportList from 'react-viewport-list'

import { useTypedSelector } from '../../store/storeHooks'
import { bytecodesSelectors } from '../../store/bytecodes/bytecodes.slice'
import { OpcodeItem } from '../OpcodeItem'
import { StructlogAcordionPanel } from '../StructlogAcordionPanel'

import type { BytecodeInfoCardProps } from './BytecodeInfoCard.types'
import { StyledStack } from './styles'

export const BytecodeInfoCard = ({ ...props }: BytecodeInfoCardProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef(null)

  const activeBlock = useTypedSelector((state) => state.activeBlock)
  const activeStrucLog = useTypedSelector(
    (state) => state.structLogs.activeStructLog,
  )
  const previousActiveStrucLog = React.useRef<typeof activeStrucLog>()
  const currentAddress = activeBlock.address
  const activeBlockBytecode = useTypedSelector((state) =>
    bytecodesSelectors.selectById(state.bytecodes, currentAddress),
  )
  useEffect(() => {
    if (!activeBlockBytecode) return
    if (activeStrucLog && previousActiveStrucLog.current !== activeStrucLog) {
      previousActiveStrucLog.current = activeStrucLog
      const pcFormatted = `0x${activeStrucLog.pc.toString(16)}`
      const index = activeBlockBytecode.disassembled.findIndex(
        (opcode) => opcode.pc === pcFormatted,
      )
      if (index) listRef.current?.scrollToIndex(index)
    }
  }, [activeStrucLog])

  if (!activeBlockBytecode) return null

  const label = activeBlockBytecode.bytecode
    ? `Bytecode (${currentAddress})`
    : `Bytecode (no bytecode loaded for ${currentAddress})`
  return (
    <StructlogAcordionPanel
      text={label}
      canExpand={activeBlockBytecode.disassembled?.length > 0}
    >
      {activeBlockBytecode.disassembled?.length > 0 ? (
        <StyledStack ref={ref} {...props}>
          <ViewportList
            ref={listRef}
            viewportRef={ref}
            items={activeBlockBytecode.disassembled}
            withCache={true}
          >
            {(item) => {
              return <OpcodeItem key={item.pc} opcode={item}></OpcodeItem>
            }}
          </ViewportList>
        </StyledStack>
      ) : null}
    </StructlogAcordionPanel>
  )
}
