import React, { useEffect, useState } from 'react'
import ViewportList from 'react-viewport-list'

import { disassembleBytecode } from '../../helpers/disassembler'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import {
  bytecodesSelectors,
  updateBytecode,
} from '../../store/bytecodes/bytecodes.slice'
import { OpcodeItem } from '../OpcodeItem'
import { StructlogAcordionPanel } from '../StructlogAcordionPanel'
import type { TOpcodeDisassemled } from '../../types'

import type { BytecodeInfoCardProps } from './BytecodeInfoCard.types'
import { StyledStack } from './styles'

export const BytecodeInfoCard = ({ ...props }: BytecodeInfoCardProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const dispatch = useTypedDispatch()
  const activeBlockBytecode = useTypedSelector((state) =>
    bytecodesSelectors.selectById(
      state.bytecodes,
      state.activeBlock.storageAddress,
    ),
  )
  const [disassembledCode, setDisassembledCode] = useState<
    TOpcodeDisassemled[]
  >([])

  const addDisassembledCode = (id: string, value: TOpcodeDisassemled[]) => {
    dispatch(updateBytecode({ id, changes: { disassembled: value } }))
  }
  useEffect(() => {
    const getBytecode = async () => {
      try {
        if (activeBlockBytecode.bytecode && !activeBlockBytecode.disassembled) {
          const result = await disassembleBytecode(activeBlockBytecode.bytecode)
          result && setDisassembledCode(result)
          addDisassembledCode(activeBlockBytecode.address, result)
        } else if (activeBlockBytecode.disassembled)
          setDisassembledCode(activeBlockBytecode.disassembled)
      } catch (error) {
        console.log('Disassembling error', error)
      }
    }
    getBytecode()
  }, [activeBlockBytecode])

  return (
    <StructlogAcordionPanel
      text="Bytecode"
      canExpand={disassembledCode.length > 0}
    >
      <StyledStack ref={ref} {...props}>
        <ViewportList
          viewportRef={ref}
          items={disassembledCode}
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
