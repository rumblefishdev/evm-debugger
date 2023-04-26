import React from 'react'

import { sourceCodesSelectors, updateSourceCode } from '../../../store/sourceCodes/sourceCodes.slice'
import { useTypedDispatch, useTypedSelector } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { SourceCodeDisplayer } from '../../../components/SourceCodeDisplayer'
import { contractNamesSelectors } from '../../../store/contractNames/contractNames'

import { StyledHeading, StyledStack, StyledWrapper } from './styles'

export const SourcecodesManager = () => {
  const dispatch = useTypedDispatch()
  const addSourcecode = (id: string, value: string) => {
    dispatch(updateSourceCode({ id, changes: { sourceCode: value } }))
  }

  const data = useTypedSelector((state) => sourceCodesSelectors.selectAll(state.sourceCodes))

  const contractNames = useTypedSelector((state) => contractNamesSelectors.selectEntities(state.contractNames))

  return (
    <StyledStack>
      <StyledHeading>Source Codes</StyledHeading>
      <StyledWrapper>
        {data.map((item) => (
          <ManagerItem
            key={item.address}
            address={item.address}
            name={contractNames[item.address]?.contractName}
            value={item.sourceCode}
            isFound={item.sourceCode !== null}
            updateItem={addSourcecode}
            displayer={SourceCodeDisplayer}
          />
        ))}
      </StyledWrapper>
    </StyledStack>
  )
}
