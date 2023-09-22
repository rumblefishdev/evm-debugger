import React from 'react'
import { useSelector } from 'react-redux'

import { useTypedDispatch } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { SourceCodeDisplayer } from '../../../components/SourceCodeDisplayer'
import { contractNamesSelectors } from '../../../store/contractNames/contractNames.selectors'
import { sourceCodesSelectors } from '../../../store/sourceCodes/sourceCodes.selectors'
import { sourceCodesActions } from '../../../store/sourceCodes/sourceCodes.slice'

import { StyledHeading, StyledStack, StyledWrapper } from './styles'

export const SourcecodesManager = () => {
  const dispatch = useTypedDispatch()
  const addSourcecode = (id: string, value: string) => {
    dispatch(sourceCodesActions.updateSourceCode({ id, changes: { sourceCode: value } }))
  }

  const sourceCodes = useSelector(sourceCodesSelectors.selectAll)
  const contractNames = useSelector(contractNamesSelectors.selectAll)

  const sourceCodesWithNames = sourceCodes.map((sourceCode) => ({
    ...sourceCode,
    name: contractNames.find((item) => item.address === sourceCode.address).contractName || sourceCode.address,
  }))

  return (
    <StyledStack>
      <StyledHeading>Source Codes</StyledHeading>
      <StyledWrapper>
        {sourceCodesWithNames.map((item) => (
          <ManagerItem
            key={item.address}
            address={item.address}
            name={item.name}
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
