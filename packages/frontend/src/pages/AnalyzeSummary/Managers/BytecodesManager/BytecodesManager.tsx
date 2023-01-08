import React from 'react'

import { bytecodesAdapter, updateBytecode } from '../../../../store/bytecodes/bytecodes.slice'
import { useTypedSelector, useTypedDispatch } from '../../../../store/storeHooks'
import { ManagerItem } from '../../../../components/ManagerItem'
import { StyledHeading, StyledStack, StyledWrapper } from '../styles'

import type { BytecodesManagerProps } from './BytecodesManager.types'

export const BytecodesManager = ({ ...props }: BytecodesManagerProps) => {
  const dispatch = useTypedDispatch()
  const addBytecode = (id: string, value: string) => {
    dispatch(updateBytecode({ id, changes: { bytecode: value } }))
  }

  const data = useTypedSelector((state) => bytecodesAdapter.getSelectors().selectAll(state.bytecodes))

  return (
    <StyledStack {...props}>
      <StyledHeading>Bytecodes</StyledHeading>
      <StyledWrapper>
        {data.map((item) => (
          <ManagerItem
            key={item.address}
            name={item.address}
            value={item.bytecode}
            isFound={item.bytecode !== null}
            updateItem={addBytecode}
          />
        ))}
      </StyledWrapper>
    </StyledStack>
  )
}
