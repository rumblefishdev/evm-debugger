import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const selectActiveStructLogState = createSelector([selectReducer(StoreKeys.ACTIVE_STRUCT_LOG)], (state) => state)

const selectActiveStructLog = createSelector(selectActiveStructLogState, (state) => state)

export const activeStructLogSelectors = { selectActiveStructLog }
