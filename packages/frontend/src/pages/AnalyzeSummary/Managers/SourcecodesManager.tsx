import { useSelector } from 'react-redux'

import { ManagerItem } from '../../../components/ManagerItem'

import { StyledContentWrapper, StyledHeading, StyledStack, StyledWrapper } from './styles'

export const SourcecodesManager = () => {
  const addSourcecode = (_: string, __: string) => {}

  const sourceCodesWithNames = useSelector(sourceCodesSelectors.selectAllWithContractNames)

  return (
    <StyledStack>
      <StyledHeading>Source Codes</StyledHeading>
      <StyledContentWrapper>
        <StyledWrapper>
          {sourceCodesWithNames.map((item) => (
            <ManagerItem
              key={item.address}
              address={item.address}
              name={item.name}
              value={item.sourceCode}
              isFound={item.sourceCode !== null}
              updateItem={addSourcecode}
              contentType="solidity"
            />
          ))}
        </StyledWrapper>
      </StyledContentWrapper>
    </StyledStack>
  )
}
