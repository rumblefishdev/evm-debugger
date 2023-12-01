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

// TODO: remove this trick after demo
const predefinedOrderForContract = [
  '@openzeppelin/contracts/access/Ownable.sol',
  '@openzeppelin/contracts/interfaces/IERC1967.sol',
  '@openzeppelin/contracts/interfaces/draft-IERC1822.sol',
  '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol',
  '@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol',
  '@openzeppelin/contracts/proxy/Proxy.sol',
  '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol',
  '@openzeppelin/contracts/proxy/beacon/IBeacon.sol',
  '@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol',
  '@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol',
  '@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol',
  '@openzeppelin/contracts/utils/Address.sol',
  '@openzeppelin/contracts/utils/Context.sol',
  '@openzeppelin/contracts/utils/StorageSlot.sol',
]
const selectCurrentSourceFiles = createSelector(
  [selectCurrentSourceCode, contractNamesSelectors.selectAll],
  (_sourceCode, _contractNames) => {
    const currentSourceName = _contractNames.find(({ address }) => address === _sourceCode?.address)?.contractName
    const parseSourceCodeResult = parseSourceCode(currentSourceName, _sourceCode?.sourceCode || '')

    let sources = Object.entries(parseSourceCodeResult).sort(([aName], [bName]) => {
      const aNamePrepared = aName.split('/').slice(0, -1).join('').toLocaleLowerCase()
      const bNamePrepared = bName.split('/').slice(0, -1).join('').toLocaleLowerCase()
      return aNamePrepared.localeCompare(bNamePrepared, undefined, { sensitivity: 'base' })
    })

    if (_sourceCode?.address === '0x9d9b975a31428fbf98dbd062c518db4d8ac31a8d') {
      const test = Object.fromEntries(predefinedOrderForContract.map((predefinedSource) => [predefinedSource, { content: '' }]))

      sources.forEach(([sourceName2, sourceDetails]) => {
        test[sourceName2] = { content: sourceDetails }
      })

      sources = Object.entries(test).map(([sourceName2, sourceDetails]) => {
        return [sourceName2, sourceDetails.content]
      })
    }

    return sources.map(([name, sourceCode]) => ({ sourceCode, name }))
    // .sort(
    //   (a, b) =>
    //     a.name.split('/').slice(0, -1).join('/').localeCompare(b.name.split('/').slice(0, -1).join('/')) ||
    //     a.name.split('/').at(-1).localeCompare(b.name.split('/').at(-1)),
    // )
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
