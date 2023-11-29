import React from 'react'
import { useSelector } from 'react-redux'

import { bytecodesActions } from '../../../store/bytecodes/bytecodes.slice'
import { useTypedDispatch } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { bytecodesSelectors } from '../../../store/bytecodes/bytecodes.selectors'

import { StyledContentWrapper, StyledHeading, StyledStack, StyledWrapper } from './styles'

export const BytecodesManager = () => {
  const dispatch = useTypedDispatch()
  const addBytecode = (id: string, value: string) => {
    dispatch(bytecodesActions.updateBytecode({ id, changes: { bytecode: value } }))
  }

  const bytecodesWithNames = useSelector(bytecodesSelectors.selectAllWithContractNames)

  return (
    <StyledStack>
      <StyledHeading>Bytecodes</StyledHeading>
      <StyledContentWrapper>
        <StyledWrapper>
          {bytecodesWithNames.map((item) => (
            <ManagerItem
              key={item.address}
              name={item.contractName}
              address={item.address}
              value={item.bytecode}
              isFound={item.bytecode !== null}
              updateItem={addBytecode}
              contentType="plain_text"
            />
          ))}
        </StyledWrapper>
      </StyledContentWrapper>
    </StyledStack>
  )
}
