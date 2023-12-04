import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { parseSourceCode } from '../../helpers/sourceCodeParser'

import { sourceCodesAdapter } from './sourceCodes.slice'
import type { TSourceCodes } from './sourceCodes.types'
import { mapSourceCode, reduceToAddressSources } from './sourceCodes.utiils'

const selectSourceCodesState = createSelector([selectReducer(StoreKeys.SOURCE_CODES)], (state) => state)

const selectEntities = createSelector([selectSourceCodesState], (state) => sourceCodesAdapter.getSelectors().selectEntities(state))

const selectAll = createSelector([selectSourceCodesState], (state) => sourceCodesAdapter.getSelectors().selectAll(state))

const selectGroupedByAddress = createSelector([selectAll], (sourceCodes) => {
  return sourceCodes.reduce((accumulator: Record<string, TSourceCodes>, sourceCode) => {
    accumulator[sourceCode.address] = sourceCode
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
      return sourceCode ? { ...contractName, ...sourceCode } : { ...contractName, sourcesOrder: null, sourceCode: null }
    })
  },
)

const selectCurrentSourceCode = createSelector([selectAll, activeBlockSelectors.selectActiveBlock], (_sourceCodes, _activeBlock) => {
  return _sourceCodes.find(({ address }) => address === _activeBlock?.address)
})

const selectIsSourceCodeAvailable = createSelector([selectCurrentSourceCode], (_sourceCode) => Boolean(_sourceCode))

const selectParsedToSourceFiles = createSelector([selectAllWithContractNames], (_sourceCode) => {
  return _sourceCode
    .filter(({ contractName }) => contractName !== null)
    .map(mapSourceCode)
    .reduce(reduceToAddressSources, {})
})
const selectCurrentSourceFiles = createSelector(
  [selectCurrentSourceCode, contractNamesSelectors.selectAll],
  (_sourceCode, _contractNames) => {
    const currentSourceName = _contractNames.find(({ address }) => address === _sourceCode?.address)?.contractName
    if (!currentSourceName) return []
    const parseSourceCodeResult = parseSourceCode(currentSourceName, _sourceCode?.sourceCode || '')
    const sourcesOrder = _sourceCode?.sourcesOrder

    const sources = Object.entries(sourcesOrder).map(([_, name]) => {
      const sourceCode = parseSourceCodeResult[name] || ''
      return [name, sourceCode]
    })

    return sources.map(([name, sourceCode]) => ({ sourceCode, name }))
  },
)

const selectHasMultipleSourceFiles = createSelector([selectCurrentSourceFiles], (_sourceFiles) => _sourceFiles.length > 1)

export const sourceCodesSelectors = {
  selectParsedToSourceFiles,
  selectIsSourceCodeAvailable,
  selectHasMultipleSourceFiles,
  selectGroupedByAddress,
  selectCurrentSourceFiles,
  selectCurrentSourceCode,
  selectByAddress,
  selectAllWithContractNames,
  selectAll,
}
