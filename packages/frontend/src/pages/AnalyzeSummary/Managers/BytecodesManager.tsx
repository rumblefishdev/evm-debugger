import React from 'react'

import { bytecodesAdapter, bytecodesActions } from '../../../store/bytecodes/bytecodes.slice'
import { useTypedSelector, useTypedDispatch } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { contractNamesSelectors } from '../../../store/contractNames/contractNames.slice'

import { StyledHeading, StyledStack, StyledWrapper } from './styles'

export const BytecodesManager = () => {
  const dispatch = useTypedDispatch()
  const addBytecode = (id: string, value: string) => {
    dispatch(bytecodesActions.updateBytecode({ id, changes: { bytecode: value } }))
  }

  const data = useTypedSelector((state) => bytecodesAdapter.getSelectors().selectAll(state.bytecodes))

  const contractNames = useTypedSelector((state) => contractNamesSelectors.selectEntities(state.contractNames))

  return (
    <StyledStack>
      <StyledHeading>Bytecodes</StyledHeading>
      <StyledWrapper>
        {data.map((item) => (
          <ManagerItem
            key={item.address}
            name={contractNames[item.address]?.contractName}
            address={item.address}
            value={item.bytecode}
            isFound={item.bytecode !== null}
            updateItem={addBytecode}
          />
        ))}
      </StyledWrapper>
    </StyledStack>
  )
}
