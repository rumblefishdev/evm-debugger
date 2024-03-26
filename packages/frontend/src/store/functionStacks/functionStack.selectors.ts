import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { functionStackAdapter } from './functionStack.slice'

const selectContractBaseState = createSelector([selectReducer(StoreKeys.FUNCTION_STACK)], (state) => state)

const selectAll = createSelector([selectContractBaseState], (state) => functionStackAdapter.getSelectors().selectAll(state))
const selectEntities = createSelector([selectContractBaseState], (state) => functionStackAdapter.getSelectors().selectEntities(state))

export const functionStackSelectors = { selectEntities, selectAll }
