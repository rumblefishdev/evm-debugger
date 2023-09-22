import type { JsonFragment } from '@ethersproject/abi'
import Tooltip from '@mui/material/Tooltip'
import { useSelector } from 'react-redux'

import { useTypedDispatch } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { contractNamesSelectors } from '../../../store/contractNames/contractNames.selectors'
import { rawTxDataSelectors } from '../../../store/rawTxData/rawTxData.selectors'
import { sighashSelectors } from '../../../store/sighash/sighash.selectors'
import { sighashActions } from '../../../store/sighash/sighash.slice'

import { StyledStack, StyledHeading, StyledAddress, StyledWrapper, StyledSighashesWrapper, StyledAbisWrapper } from './styles'

const addSighash = (id: string, value: string) => {
  const dispatch = useTypedDispatch()
  dispatch(sighashActions.updateSighash({ id, changes: { sighash: value } }))
}

function formatFragment(fragment: JsonFragment) {
  return `${fragment.name}(${fragment.inputs.map((input) => input.type).join(',')})`
}

export const SighashesManager = () => {
  const sighashes = useSelector(sighashSelectors.selectAll)
  const contractAddresses = useSelector(rawTxDataSelectors.selectContractAddresses)
  const contractNames = useSelector(contractNamesSelectors.selectAll)

  return (
    <StyledStack>
      <StyledHeading>Sighashes</StyledHeading>
      <StyledAbisWrapper>
        {contractAddresses.map((address) => {
          const filteredSighashes = sighashes.filter((sighash) => sighash.addresses.has(address))
          return (
            <StyledSighashesWrapper key={address}>
              <Tooltip
                title={address}
                arrow
                followCursor
              >
                <StyledAddress>{contractNames[address]?.contractName || address}</StyledAddress>
              </Tooltip>
              <StyledWrapper>
                {filteredSighashes.map((sighash) => (
                  <ManagerItem
                    key={sighash.sighash}
                    address={address}
                    name={sighash.fragment ? formatFragment(sighash.fragment) : sighash.sighash}
                    value={JSON.stringify(sighash.fragment, null, 2)}
                    isFound={sighash.fragment !== null}
                    updateItem={addSighash}
                  />
                ))}
              </StyledWrapper>
            </StyledSighashesWrapper>
          )
        })}
      </StyledAbisWrapper>
    </StyledStack>
  )
}
