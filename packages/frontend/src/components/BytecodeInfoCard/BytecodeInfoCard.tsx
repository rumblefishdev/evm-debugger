import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Tooltip } from '@mui/material';

import { disassembleBytecode } from '../../helpers/disassembler'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { bytecodesSelectors, updateBytecode } from '../../store/bytecodes/bytecodes.slice'
import { OpcodeItem } from '../OpcodeItem';
import { StructlogAcordionPanel } from '../StructlogAcordionPanel';

import type { BytecodeInfoCardProps } from './BytecodeInfoCard.types'

import { StyledBox, StyledRecord } from './styles'
import type { TOpcodeDisassemled } from '../../types';

export const BytecodeInfoCard = ({ ...props }: BytecodeInfoCardProps) => {
    const dispatch = useTypedDispatch()
    const [disassembledCode, setDisassembledCode] = useState<TOpcodeDisassemled[]>([])
    const activeBlockBytecode = useTypedSelector((state) => bytecodesSelectors.selectById(state.bytecodes, state.activeBlock.storageAddress)) 
    const addDisassembledCode = (id: string, value: TOpcodeDisassemled[]) => {
        dispatch(updateBytecode({ id, changes: { disassembled: value } }))
    }


    useEffect(() => {
        console.log('efekt before', activeBlockBytecode)
        const getBytecode = async () => {
            try{
                if(activeBlockBytecode && !activeBlockBytecode.disassembled) {
                    const result = await disassembleBytecode(activeBlockBytecode.bytecode)    
                    result && setDisassembledCode(result)
                    addDisassembledCode(activeBlockBytecode.address, result)
                    console.log('efekt result', result.length)
                } else {
                    setDisassembledCode(activeBlockBytecode.disassembled)
                }
            } catch(error) {
                console.log('efekt error',error)
            }
        }
            
        getBytecode()
    },[activeBlockBytecode])

console.log('tst zupa zdeasemblowana', disassembledCode.length > 0 ? disassembledCode[0] : undefined)

return (
<StructlogAcordionPanel text="Bytecode" canExpand={disassembledCode.length > 0}>
<StyledBox {...props}>
    {disassembledCode.length > 0 ?
    disassembledCode.map((stackItem) => {
      return (
        <StyledRecord direction="row">
            <OpcodeItem opcode={stackItem}></OpcodeItem>
        </StyledRecord>
      )
    }) : null}
</StyledBox>
</StructlogAcordionPanel>
)
}
