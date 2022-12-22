import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { disassembleBytecode } from '../../helpers/disassembler'
import { useTypedSelector } from '../../store/storeHooks'
import { bytecodesSelectors } from '../../store/bytecodes/bytecodes.slice'

import { StyledStack } from './styles'
import type { BytecodeInfoCardProps } from './BytecodeInfoCard.types'

const exampleDis = `    
"_opcode": 96,
"_name": "PUSH",
"_operand_size": 1,
"_pops": 0,
"_pushes": 1,
"_fee": 3,
"_description": "Place 1 byte item on stack.",
"_operand": 128,
"_pc": 0`


export const BytecodeInfoCard = ({ storage, ...props }: BytecodeInfoCardProps) => {
    // const [tst, setTst] = useState<string>()
    const [disassembledCode, setDisassembledCode] = useState<string>(exampleDis)
    const data = useTypedSelector((state) => bytecodesSelectors.selectAll(state.bytecodes))
    const activeAddress = useTypedSelector((state) => state.activeBlock).storageAddress

    const activeBytecode = useMemo(()=>{ return data.find(x => x.address === activeAddress).bytecode},[activeAddress])
    
    const handleDisassemble = useCallback((hexcode: string) => {
        disassembleBytecode(hexcode)
        .then((result) => {

            console.log('tst result', result)
            setDisassembledCode(result)
        })


    },[])

    // const disassembledCodeTst = useMemo(() => {
    //     const promise = disassembleBytecode(codeToDisassemble)
    //     promise
    //     .then((result) => {
    //         console.log('tst memo', result)
    //         return result
    //     })
    // },[codeToDisassemble, storage])

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
console.log('tst dupa zdeasemblowana', disassembledCode)

return (
    // <StyledBox {...props}>
    //     {
    //     <button type="submit" id="submitCode" onClick={()=>handleDisassemble(hexcode)}>Disassemble</button>
    // }
    // <text>"hej"</text>
    // </StyledBox>
    <StyledStack {...props}>
        <button type="submit" id="submitCode" onClick={()=>handleDisassemble(activeBytecode)}>Disassemble</button>

        <div>
          {activeAddress}: {disassembledCode}
        </div>

  </StyledStack>

    )
}