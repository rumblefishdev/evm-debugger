import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Tooltip } from '@mui/material';

import { disassembleBytecode } from '../../helpers/disassembler'
import { useTypedSelector } from '../../store/storeHooks'
import { bytecodesSelectors } from '../../store/bytecodes/bytecodes.slice'
import { OpcodeItem } from '../OpcodeItem';
import { StructlogAcordionPanel } from '../StructlogAcordionPanel';
import type { IOpCodeDisassemled } from '../OpcodeItem/OpcodeItem.types';

import type { BytecodeInfoCardProps } from './BytecodeInfoCard.types'
import { StyledBox, StyledRecord } from './styles'


const exampleDis = `    
"_opcode": 96,/n
"_name": "PUSH",
"_operand_size": 1,
"_pops": 0,
"_pushes": 1,
"_fee": 3,
"_description": "Place 1 byte item on stack.",
"_operand": 128,
"_pc": 0`

const tst: IOpCodeDisassemled = {
    pushes: 1,
    pops: 0,
    pc: 0,
    operandSize: 1,
    operand: 128,
    opcode: 96,
    name: "PUSH1",
    fee: 3,
    description: "Place 1 byte item on stack."
}

const tst2: IOpCodeDisassemled = {
    pushes: 1,
    pops: 1,
    pc: 8,
    operandSize: 0,
    operand: 128,
    opcode: 84,
    name: "SLOAD",
    fee: 800,
    description: "Load word from storage."
}

export const BytecodeInfoCard = ({ ...props }: BytecodeInfoCardProps) => {
    // const [tst, setTst] = useState<string>()
    const [disassembledCode, setDisassembledCode] = useState<string>(exampleDis)
    const data = useTypedSelector((state) => bytecodesSelectors.selectAll(state.bytecodes))
    const activeAddress = useTypedSelector((state) => state.activeBlock).storageAddress

    const activeBytecode = useMemo(()=>{ return data.find(x => x.address === activeAddress).bytecode},[activeAddress])
    
    const disassembledCodeArray = [tst,tst2,tst, tst,tst2,tst, tst,tst2,tst]
    const parsedOpcodes = useMemo(()=> {
        return disassembledCodeArray.map((singleOpCode, index) => {
            return {value: singleOpCode, index}
        })
    },[])

    useEffect(() => {
        const getBytecode = async () => {
            try{
                const result = await disassembleBytecode(activeBytecode)    
                result && setDisassembledCode(result)
                console.log('efekt result', result)
            } catch(error) {
                console.log('efekt error',error)
            }
        }

        console.log('efekt before', activeAddress, Boolean(activeBytecode))
            
        getBytecode()
    },[activeBytecode])

console.log('tst code', data)
console.log('tst disass', Boolean(activeBytecode), data[2].address)
console.log('tst zupa zdeasemblowana', disassembledCode)

return (
<StructlogAcordionPanel text="Bytecode" canExpand={parsedOpcodes.length > 0}>
<StyledBox {...props}>
    {parsedOpcodes.map((stackItem) => {
      return (
        <StyledRecord direction="row">
            <Tooltip title={'ELOOOOOOOOOOOOOOOO'} >
                <OpcodeItem opcode={stackItem.value}></OpcodeItem>
            </Tooltip>
        </StyledRecord>
      )
    })}
</StyledBox>
</StructlogAcordionPanel>
)
}
