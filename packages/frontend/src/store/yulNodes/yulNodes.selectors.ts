import { createSelector } from '@reduxjs/toolkit'
import { NodeType } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { instructionsSelectors } from '../instructions/instructions.selectors'
import { createSourceMapIdentifier } from '../instructions/instructions.helpers'

import {
  yulBaseNodeAdapter,
  yulAssignmentNodeAdapter,
  yulBlockNodeAdapter,
  yulExpressionStatementNodeAdapter,
  yulForLoopNodeAdapter,
  yulFunctionCallNodeAdapter,
  yulFunctionDefinitionNodeAdapter,
  yulIdentifierNodeAdapter,
  yulIfNodeAdapter,
  yulLiteralNodeAdapter,
  yulTypedNameNodeAdapter,
  yulVariableDeclarationNodeAdapter,
} from './yulNodes.adapters'
import type { TExtendedYulNodeElement, TYulNodeBaseWithListIndex } from './yulNodes.types'

const selectYulNodesState = createSelector([selectReducer(StoreKeys.YUL_NODES)], (state) => state)

const selectCurrentYulNodes = createSelector(
  [selectYulNodesState, activeBlockSelectors.selectActiveBlock],
  (_yulNodesState, _activeBlock) => {
    return _yulNodesState[_activeBlock?.address]
  },
)

// ===============================|| YUL NODE TYPES SELECTORS ||=============================== //

const selectCurrentBaseYulNodes = createSelector([selectCurrentYulNodes], (allYulNodes) => {
  return yulBaseNodeAdapter.getSelectors().selectEntities(allYulNodes?.yulNodes)
})

const selectCurrentYulBlockNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulBlockNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulBlocks)
})

const selectCurrentYulAssignmentNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulAssignmentNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulAssignments)
})

const selectCurrentYulExpressionStatementNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulExpressionStatementNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulExpressionStatements)
})

const selectCurrentYulForLoopNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulForLoopNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulForLoops)
})

const selectCurrentYulFunctionCallNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulFunctionCallNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulFunctionCalls)
})

const selectCurrentYulFunctionDefinitionNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulFunctionDefinitionNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulFunctionDefinitions)
})

const selectCurrentYulIdentifierNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulIdentifierNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulIdentifiers)
})

const selectCurrentYulIfNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulIfNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulIfs)
})

const selectCurrentYulLiteralNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulLiteralNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulLiterals)
})

const selectCurrentYulTypedNameNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulTypedNameNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulTypedNames)
})

const selectCurrentYulVariableDeclarationNodes = createSelector([selectCurrentYulNodes], (currentYulNodes) => {
  return yulVariableDeclarationNodeAdapter.getSelectors().selectEntities(currentYulNodes.yulVariableDeclarations)
})

// =============================== =================================== =============================== //

const selectCurrentBaseYulNodesWithListIndex = createSelector([selectCurrentBaseYulNodes], (currentYulNodes) => {
  const mapped = Object.values(currentYulNodes).map((yulNode, listIndex) => ({ listIndex, ...yulNode }))
  return mapped.reduce((accumulator, yulNode) => {
    accumulator[yulNode.rootSrc] = yulNode
    return accumulator
  }, {} as Record<string, TYulNodeBaseWithListIndex>)
})

const selectCurrentBaseYulNodesWithExtendedData = createSelector(
  [
    selectCurrentBaseYulNodesWithListIndex,
    selectCurrentYulBlockNodes,
    selectCurrentYulAssignmentNodes,
    selectCurrentYulExpressionStatementNodes,
    selectCurrentYulForLoopNodes,
    selectCurrentYulFunctionCallNodes,
    selectCurrentYulFunctionDefinitionNodes,
    selectCurrentYulIdentifierNodes,
    selectCurrentYulIfNodes,
    selectCurrentYulLiteralNodes,
    selectCurrentYulTypedNameNodes,
    selectCurrentYulVariableDeclarationNodes,
  ],
  (
    _currentYulNodes,
    _currentYulBlockNodes,
    _currentYulAssigmentNodes,
    _currentYulExpressionStatementNodes,
    _currentYulForLoopNodes,
    _currentYulFunctionCallNodes,
    _currentYulFunctionDefinitionNodes,
    _currentYulIdentifierNodes,
    _currentYulIfNodes,
    _currentYulLiteralNodes,
    _currentYulTypedNameNodes,
    _currentYulVariableDeclarationNodes,
  ) => {
    console.log('_currentYulNodes', _currentYulNodes)
    console.log('_currentYulBlockNodes', _currentYulBlockNodes)
    console.log('_currentYulAssigmentNodes', _currentYulAssigmentNodes)
    console.log('_currentYulExpressionStatementNodes', _currentYulExpressionStatementNodes)
    console.log('_currentYulForLoopNodes', _currentYulForLoopNodes)
    console.log('_currentYulFunctionCallNodes', _currentYulFunctionCallNodes)
    console.log('_currentYulFunctionDefinitionNodes', _currentYulFunctionDefinitionNodes)
    console.log('_currentYulIdentifierNodes', _currentYulIdentifierNodes)
    console.log('_currentYulIfNodes', _currentYulIfNodes)
    console.log('_currentYulLiteralNodes', _currentYulLiteralNodes)
    console.log('_currentYulTypedNameNodes', _currentYulTypedNameNodes)
    console.log('_currentYulVariableDeclarationNodes', _currentYulVariableDeclarationNodes)

    return Object.values(_currentYulNodes).map<TExtendedYulNodeElement>((yulNode) => {
      return {
        ...yulNode,
        variableDeclaration: _currentYulVariableDeclarationNodes[yulNode.rootSrc],
        typedName: _currentYulTypedNameNodes[yulNode.rootSrc],
        literal: _currentYulLiteralNodes[yulNode.rootSrc],
        if: _currentYulIfNodes[yulNode.rootSrc],
        identifier: _currentYulIdentifierNodes[yulNode.rootSrc],
        functionDefinition: _currentYulFunctionDefinitionNodes[yulNode.rootSrc],
        functionCall: _currentYulFunctionCallNodes[yulNode.rootSrc],
        forLoop: _currentYulForLoopNodes[yulNode.rootSrc],
        expressionStatement: _currentYulExpressionStatementNodes[yulNode.rootSrc],
        block: _currentYulBlockNodes[yulNode.rootSrc],
        assignment: _currentYulAssigmentNodes[yulNode.rootSrc],
      }
    })
    // .filter(
    //   (node) =>
    //     node.rootNodeType !== NodeType.YulTypedName &&
    //     node.rootNodeType !== NodeType.YulLiteral &&
    //     node.rootNodeType !== NodeType.YulIdentifier,
    // )
  },
)

const selectCurrentHasYulNodes = createSelector([selectCurrentBaseYulNodes], (currentYulNodes) => Object.keys(currentYulNodes).length > 0)

const selectActiveYulNode = createSelector(
  [instructionsSelectors.selectCurrentInstruction, selectCurrentBaseYulNodesWithListIndex],
  (currentInstruction, currentYulNodes) => {
    if (!currentInstruction) return null
    const indentifier = createSourceMapIdentifier(currentInstruction)
    return currentYulNodes[indentifier] || null
  },
)

export const yulNodesSelectors = {
  selectYulNodesState,
  selectCurrentHasYulNodes,
  selectCurrentBaseYulNodesWithListIndex,
  selectCurrentBaseYulNodesWithExtendedData,
  selectCurrentBaseYulNodes,
  selectActiveYulNode,
}
