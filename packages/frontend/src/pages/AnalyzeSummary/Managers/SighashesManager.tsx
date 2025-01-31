import type { JsonFragment } from '@ethersproject/abi'
import Tooltip from '@mui/material/Tooltip'
import { useSelector } from 'react-redux'

import { useTypedDispatch } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { sighashSelectors } from '../../../store/sighash/sighash.selectors'
import { sighashActions } from '../../../store/sighash/sighash.slice'
import { contractBaseSelectors } from '../../../store/contractBase/contractBase.selectors'

import { StyledStack, StyledHeading, StyledAddress, StyledWrapper, StyledSighashesWrapper, StyledContentWrapper } from './styles'

const addSighash = (id: string, value: string) => {
  const dispatch = useTypedDispatch()
  dispatch(sighashActions.updateSighash({ id, changes: { sighash: value } }))
}

function formatFragment(fragment: JsonFragment) {
  return `${fragment.name}(${fragment.inputs.map((input) => input.type).join(',')})`
}

export const SighashesManager = () => {
  const sighashesWithNames = useSelector(sighashSelectors.selectAllWithContractNames)
  const contractNames = useSelector(contractBaseSelectors.selectAll)

  return (
    <StyledStack>
      <StyledHeading>Sighashes</StyledHeading>
      <StyledContentWrapper>
        {contractNames.map((contract) => {
          const filteredSighashes = sighashesWithNames.filter((sighash) => sighash.addresses.has(contract.address))
          return (
            <StyledSighashesWrapper key={contract.address}>
              <Tooltip
                title={contract.address}
                arrow
                followCursor
              >
                <StyledAddress>{contract.name || contract.address}</StyledAddress>
              </Tooltip>
              <StyledWrapper>
                {filteredSighashes.map((sighash) => (
                  <ManagerItem
                    key={sighash.sighash}
                    address={contract.address}
                    name={sighash.fragment ? formatFragment(sighash.fragment) : sighash.sighash}
                    value={JSON.stringify(sighash.fragment, null, 2)}
                    isFound={sighash.fragment !== null}
                    updateItem={addSighash}
                    contentType="json"
                  />
                ))}
              </StyledWrapper>
            </StyledSighashesWrapper>
          )
        })}
      </StyledContentWrapper>
    </StyledStack>
  )
}
