import React from 'react'
import { useSelector } from 'react-redux'

import { bytecodesActions } from '../../../store/bytecodes/bytecodes.slice'
import { useTypedDispatch } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { bytecodesSelectors } from '../../../store/bytecodes/bytecodes.selectors'
import { contractNamesSelectors } from '../../../store/contractNames/contractNames.selectors'

import { StyledHeading, StyledStack, StyledWrapper } from './styles'

export const BytecodesManager = () => {
  const dispatch = useTypedDispatch()
  const addBytecode = (id: string, value: string) => {
    dispatch(bytecodesActions.updateBytecode({ id, changes: { bytecode: value } }))
  }

  const bytecodes = useSelector(bytecodesSelectors.selectAll)
  const contractNames = useSelector(contractNamesSelectors.selectAll)

  return (
    <StyledStack>
      <StyledHeading>Bytecodes</StyledHeading>
      <StyledWrapper>
        {bytecodes.map((item) => (
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
