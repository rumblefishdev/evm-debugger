import type { JsonFragment } from '@ethersproject/abi'
import Tooltip from '@mui/material/Tooltip'

import { sighashAdapter, updateSighash } from '../../../store/sighash/sighash.slice'
import { useTypedDispatch, useTypedSelector } from '../../../store/storeHooks'
import { ManagerItem } from '../../../components/ManagerItem'
import { contractNamesSelectors } from '../../../store/contractNames/contractNames'

import { StyledStack, StyledHeading, StyledAddress, StyledWrapper, StyledSighashesWrapper, StyledAbisWrapper } from './styles'

const addSighash = (id: string, value: string) => {
  const dispatch = useTypedDispatch()
  dispatch(updateSighash({ id, changes: { sighash: value } }))
}

function formatFragment(fragment: JsonFragment) {
  return `${fragment.name}(${fragment.inputs.map((input) => input.type).join(',')})`
}

export const SighashesManager = () => {
  const sighashes = useTypedSelector((state) => sighashAdapter.getSelectors().selectAll(state.sighashes))
  const contractAddresses = useTypedSelector((state) => state.rawTxData.contractAddresses)

  const contractNames = useTypedSelector((state) => contractNamesSelectors.selectEntities(state.contractNames))

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
