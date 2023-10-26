import React from 'react'
import { useSelector } from 'react-redux'

import { useTypedDispatch } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { sourceCodesSelectors } from '../../../store/sourceCodes/sourceCodes.selectors'
import { sourceCodesActions } from '../../../store/sourceCodes/sourceCodes.slice'

import { StyledHeading, StyledStack, StyledWrapper } from './styles'

export const SourcecodesManager = () => {
  const dispatch = useTypedDispatch()
  const addSourcecode = (id: string, value: string) => {
    dispatch(sourceCodesActions.updateSourceCode({ id, changes: { sourceCode: value } }))
  }

  const sourceCodesWithNames = useSelector(sourceCodesSelectors.selectAllWithContractNames)

  return (
    <StyledStack>
      <StyledHeading>Source Codes</StyledHeading>
      <StyledWrapper>
        {sourceCodesWithNames.map((item) => (
          <ManagerItem
            key={item.address}
            address={item.address}
            name={item.contractName}
            value={item.sourceCode}
            isFound={item.sourceCode !== null}
            updateItem={addSourcecode}
            contentType="solidity"
          />
        ))}
      </StyledWrapper>
    </StyledStack>
  )
}
