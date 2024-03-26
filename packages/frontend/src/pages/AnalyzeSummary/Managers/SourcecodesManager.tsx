import { useSelector } from 'react-redux'

import { ManagerItem } from '../../../components/ManagerItem'
import { sourceFilesSelectors } from '../../../store/sourceFiles/sourceFiles.selectors'

import { StyledContentWrapper, StyledHeading, StyledStack, StyledWrapper } from './styles'

export const SourcecodesManager = () => {
  const addSourcecode = (_: string, __: string) => {}

  const sourceFiles = useSelector(sourceFilesSelectors.selectAll)

  return (
    <StyledStack>
      <StyledHeading>Source Codes</StyledHeading>
      <StyledContentWrapper>
        <StyledWrapper>
          {sourceFiles.map((item) => (
            <ManagerItem
              key={item.address}
              address={item.address}
              name={item.address}
              value={JSON.stringify(item.sourceFiles)}
              isFound={Boolean(item.sourceFiles)}
              updateItem={addSourcecode}
              contentType="solidity"
            />
          ))}
        </StyledWrapper>
      </StyledContentWrapper>
    </StyledStack>
  )
}
