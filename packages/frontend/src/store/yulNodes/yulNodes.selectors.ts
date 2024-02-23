import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { instructionsSelectors } from '../instructions/instructions.selectors'
import { createSourceMapIdentifier } from '../instructions/instructions.helpers'

import { yulNodeAdapterSelectors } from './yulNodes.slice'

const selectYulNodesState = createSelector([selectReducer(StoreKeys.YUL_NODES)], (state) => state)

const selectAllYulNodes = createSelector([selectYulNodesState], (yulNodesState) => {
  return yulNodeAdapterSelectors.selectAll(yulNodesState)
})

const selectCurrentYulNodes = createSelector([selectAllYulNodes, activeBlockSelectors.selectActiveBlock], (allYulNodes, activeBlock) => {
  return allYulNodes.find((yulNode) => yulNode.address === activeBlock?.address)?.yulNodes || {}
})

const selectCurrentYulNodesWithListIndex = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return Object.values(currentYulNodes).map((yulNode, listIndex) => ({ listIndex, ...yulNode }))
})

const selectCurrentHasYulNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => Object.keys(currentYulNodes).length > 0)

const selectActiveYulNode = createSelector(
  [instructionsSelectors.selectCurrentInstruction, selectCurrentYulNodes],
  (currentInstruction, currentYulNodes) => {
    if (!currentInstruction) return null
    const indentifier = createSourceMapIdentifier(currentInstruction)
    return currentYulNodes[indentifier] || null
  },
)

export const yulNodesSelectors = {
  selectYulNodesState,
  selectCurrentYulNodesWithListIndex,
  selectCurrentYulNodes,
  selectCurrentHasYulNodes,
  selectAllYulNodes,
  selectActiveYulNode,
}
