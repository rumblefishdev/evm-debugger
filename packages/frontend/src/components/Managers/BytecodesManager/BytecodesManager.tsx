import React from 'react'

import { bytecodesSelectors, updateBytecode } from '../../../store/bytecodes/bytecodes.slice'
import { useTypedSelector, useTypedDispatch } from '../../../store/storeHooks'
import { ManagerItem } from '../../ManagerItem'
import { StyledStack, StyledTitle } from '../styles'

import type { BytecodesManagerProps } from './BytecodesManager.types'

export const BytecodesManager = ({ ...props }: BytecodesManagerProps) => {
  const dispatch = useTypedDispatch()
  const addBytecode = (id: string, value: string) => {
  dispatch(updateBytecode({ id, changes: { bytecode: value } }))
}

  const data = useTypedSelector((state) => bytecodesSelectors.selectAll(state.bytecodes))

  return (
    <StyledStack {...props}>
      <StyledTitle>Bytecodes</StyledTitle>
      {data.map((item) => (
        <ManagerItem name={item.address} value={item.bytecode} isFound={item.bytecode !== null} updateItem={addBytecode} />
      ))}
    </StyledStack>
  )
}
