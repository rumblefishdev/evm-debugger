import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractBaseSelectors } from '../contractBase/contractBase.selectors'

import { contractRawAdapter } from './contractRaw.slice'

const selectContractRawState = createSelector([selectReducer(StoreKeys.CONTRACT_RAW)], (state) => state)

const selectAll = createSelector([selectContractRawState], (state) => contractRawAdapter.getSelectors().selectAll(state))

const selectBytecodesWithContractNames = createSelector([selectAll, contractBaseSelectors.selectAll], (contractsRaw, contractsBase) =>
  contractsRaw.map((contractRaw) => {
    const contractBase = contractsBase.find((contract) => contract.address === contractRaw.address)
    return {
      ...contractRaw,
      contractName: contractBase?.name || contractBase.address,
    }
  }),
)

export const contractRawSelectors = { selectBytecodesWithContractNames, selectAll }
