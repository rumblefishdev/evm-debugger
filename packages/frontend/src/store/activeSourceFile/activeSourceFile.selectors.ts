import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const selectActiveSourceFileState = createSelector([selectReducer(StoreKeys.ACTIVE_SOURCE_FILE)], (state) => state)

const selectActiveSourceFile = createSelector([selectActiveSourceFileState], (state) => state)

export const activeSourceFileSelectors = { selectActiveSourceFile }
