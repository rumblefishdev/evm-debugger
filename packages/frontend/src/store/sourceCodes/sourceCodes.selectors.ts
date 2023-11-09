import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { parseSourceCode } from '../../helpers/sourceCodeParser'

import { sourceCodesAdapter } from './sourceCodes.slice'

const selectSourceCodesState = createSelector([selectReducer(StoreKeys.SOURCE_CODES)], (state) => state)

const selectEntities = createSelector([selectSourceCodesState], (state) => sourceCodesAdapter.getSelectors().selectEntities(state))

const selectAll = createSelector([selectSourceCodesState], (state) => sourceCodesAdapter.getSelectors().selectAll(state))

const selectByAddress = createSelector([selectSourceCodesState, (_: unknown, address: string) => address], (state, address) =>
  sourceCodesAdapter.getSelectors().selectById(state, address),
)

const selectAllWithContractNames = createSelector(
  [selectEntities, contractNamesSelectors.selectAll],
  (sourceCodeEntities, contractNames) => {
    return contractNames.map((contractName) => {
      const sourceCode = sourceCodeEntities[contractName.address] || null
      return sourceCode ? { ...contractName, ...sourceCode } : { ...contractName, sourceCode: null }
    })
  },
)

const selectCurrentSourceCode = createSelector([selectAll, activeBlockSelectors.selectActiveBlock], (_sourceCodes, _activeBlock) => {
  return _sourceCodes.find(({ address }) => address === _activeBlock?.address)
})

const selectIsSourceCodeAvailable = createSelector([selectCurrentSourceCode], (_sourceCode) => Boolean(_sourceCode))

const selectCurrentSourceFiles = createSelector(
  [selectCurrentSourceCode, contractNamesSelectors.selectAll],
  (_sourceCode, _contractNames) => {
    const currentSourceName = _contractNames.find(({ address }) => address === _sourceCode?.address)?.contractName
    const parseSourceCodeResult = parseSourceCode(currentSourceName, _sourceCode?.sourceCode || '')
    return Object.entries(parseSourceCodeResult).map(([name, sourceCode]) => ({ sourceCode, name }))
  },
)

export const sourceCodesSelectors = {
  selectIsSourceCodeAvailable,
  selectCurrentSourceFiles,
  selectCurrentSourceCode,
  selectByAddress,
  selectAllWithContractNames,
  selectAll,
}
