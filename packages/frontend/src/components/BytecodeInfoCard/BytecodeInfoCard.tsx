import React from 'react'
import ViewportList from 'react-viewport-list'

import { useTypedSelector } from '../../store/storeHooks'
import { bytecodesSelectors } from '../../store/bytecodes/bytecodes.slice'
import { OpcodeItem } from '../OpcodeItem'
import { StructlogAcordionPanel } from '../StructlogAcordionPanel'

import type { BytecodeInfoCardProps } from './BytecodeInfoCard.types'
import { StyledStack } from './styles'

export const BytecodeInfoCard = ({ ...props }: BytecodeInfoCardProps) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const activeBlock = useTypedSelector((state) => state.activeBlock)
  const currentAddress = activeBlock.address
  const activeBlockBytecode = useTypedSelector((state) =>
    bytecodesSelectors.selectById(state.bytecodes, currentAddress),
  )
  if (!activeBlockBytecode) return null

  const label = activeBlockBytecode.bytecode
    ? `Bytecode (${currentAddress})`
    : `Bytecode (no bytecode loaded for ${currentAddress})`
  return (
    <StructlogAcordionPanel
      text={label}
      canExpand={activeBlockBytecode.disassembled?.length > 0}
    >
      <StyledStack ref={ref} {...props}>
        <ViewportList
          viewportRef={ref}
          items={activeBlockBytecode.disassembled}
          withCache={true}
        >
          {(item, index) => {
            return <OpcodeItem key={index} opcode={item}></OpcodeItem>
          }}
        </ViewportList>
      </StyledStack>
    </StructlogAcordionPanel>
  )
}
