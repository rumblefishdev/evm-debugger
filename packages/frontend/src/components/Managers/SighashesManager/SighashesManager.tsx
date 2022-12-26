import { Box, Stack } from '@mui/material'
import React from 'react'

import {
  sighashSelectors,
  updateSighash,
} from '../../../store/sighash/sighash.slice'
import { useTypedDispatch, useTypedSelector } from '../../../store/storeHooks'
import { ManagerItem } from '../../ManagerItem'
import { StyledStack, StyledTitle } from '../styles'

import type { SighashesManagerProps } from './SighashesManager.types'

const addSighash = (id: string, value: string) => {
  const dispatch = useTypedDispatch()
  dispatch(updateSighash({ id, changes: { sighash: value } }))
}

export const SighashesManager = ({ ...props }: SighashesManagerProps) => {
  const sighashes = useTypedSelector((state) =>
    sighashSelectors.selectAll(state.sighashes),
  )
  const contractAddresses = useTypedSelector(
    (state) => state.rawTxData.contractAddresses,
  )
  return (
    <StyledStack {...props}>
      <StyledTitle>Sighashes</StyledTitle>
      <Stack sx={{ overflow: 'auto' }}>
        {contractAddresses.map((address) => {
          const filteredSighashes = sighashes.filter((sighash) =>
            sighash.addresses.has(address),
          )
          return (
            <Stack>
              <Stack direction="row">
                <Box sx={{ fontSize: '24px' }}>{address}</Box>
              </Stack>
              {filteredSighashes.map((sighash) => (
                <ManagerItem
                  key={sighash.sighash}
                  name={
                    sighash.fragment
                      ? sighash.fragment.signature
                      : sighash.sighash
                  }
                  value={JSON.stringify(sighash.fragment, null, 2)}
                  isFound={sighash.fragment !== null}
                  updateItem={addSighash}
                />
              ))}
            </Stack>
          )
        })}
      </Stack>
    </StyledStack>
  )
}
