import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'

import { sourceFilesAdapter } from './sourceFiles.slice'

const selectSourceFilesState = createSelector([selectReducer(StoreKeys.SOURCE_FILES)], (state) => state)

const selectAll = createSelector([selectSourceFilesState], (state) => sourceFilesAdapter.getSelectors().selectAll(state))
const selectEntities = createSelector([selectSourceFilesState], (state) => sourceFilesAdapter.getSelectors().selectEntities(state))

const selectCurrentSourceFiles = createSelector([selectEntities, activeBlockSelectors.selectActiveBlock], (_sourceFiles, _activeBlock) => {
  return _sourceFiles[_activeBlock?.address || ''] || null
})

export const sourceFilesSelectors = { selectEntities, selectCurrentSourceFiles, selectAll }
