import { useSelector } from 'react-redux'

import { useTypedDispatch } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { contractRawActions } from '../../../store/contractRaw/contractRaw.slice'
import { contractRawSelectors } from '../../../store/contractRaw/contractRaw.selectors'

import { StyledContentWrapper, StyledHeading, StyledStack, StyledWrapper } from './styles'

export const BytecodesManager = () => {
  const dispatch = useTypedDispatch()
  const addBytecode = (id: string, value: string) => {
    dispatch(contractRawActions.updateOne({ id, changes: { etherscanBytecode: value } }))
  }

  const bytecodesWithNames = useSelector(contractRawSelectors.selectBytecodesWithContractNames)

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
              value={item.etherscanBytecode}
              isFound={item.etherscanBytecode !== null}
              updateItem={addBytecode}
              contentType="plain_text"
            />
          ))}
        </StyledWrapper>
      </StyledContentWrapper>
    </StyledStack>
  )
}
