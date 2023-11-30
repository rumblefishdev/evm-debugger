import { createSelector } from '@reduxjs/toolkit'
import type { TMappedSourceCodes } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { parseSourceCode } from '../../helpers/sourceCodeParser'

import { sourceCodesAdapter } from './sourceCodes.slice'

const selectSourceCodesState = createSelector([selectReducer(StoreKeys.SOURCE_CODES)], (state) => state)

const selectEntities = createSelector([selectSourceCodesState], (state) => sourceCodesAdapter.getSelectors().selectEntities(state))

const selectAll = createSelector([selectSourceCodesState], (state) => sourceCodesAdapter.getSelectors().selectAll(state))

const selectGroupedByAddress = createSelector([selectAll], (sourceCodes) => {
  return sourceCodes.reduce((accumulator: TMappedSourceCodes, sourceCode) => {
    accumulator[sourceCode.address] = sourceCode.sourceCode
    return accumulator
  }, {})
})

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
    return Object.entries(parseSourceCodeResult)
      .map(([name, sourceCode]) => ({ sourceCode, name }))
      .sort(
        (a, b) =>
          a.name.split('/').slice(0, -1).join('/').localeCompare(b.name.split('/').slice(0, -1).join('/')) ||
          a.name.split('/').at(-1).localeCompare(b.name.split('/').at(-1)),
      )
  },
)

const selectHasMultipleSourceFiles = createSelector([selectCurrentSourceFiles], (_sourceFiles) => _sourceFiles.length > 1)

export const sourceCodesSelectors = {
  selectIsSourceCodeAvailable,
  selectHasMultipleSourceFiles,
  selectGroupedByAddress,
  selectCurrentSourceFiles,
  selectCurrentSourceCode,
  selectByAddress,
  selectAllWithContractNames,
  selectAll,
}
