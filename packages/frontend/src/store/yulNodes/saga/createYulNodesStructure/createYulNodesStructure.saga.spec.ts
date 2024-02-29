import { expectSaga } from 'redux-saga-test-plan'
import { combineReducers } from 'redux'
import type { TYulBlock } from '@evm-debuger/types'
import { NodeType } from '@evm-debuger/types'
import * as matchers from 'redux-saga-test-plan/matchers'

import { StoreKeys } from '../../../store.keys'
import { yulNodesActions, yulNodesInitialState, yulNodesReducer } from '../../yulNodes.slice'
import { convertYulTreeToArray } from '../../yulNodes.utils'
import type { TParsedYulBlock } from '../../yulNodes.types'
import {
  yulAssignmentNodeAdapter,
  yulBaseNodeAdapter,
  yulBlockNodeAdapter,
  yulExpressionStatementNodeAdapter,
  yulForLoopNodeAdapter,
  yulFunctionCallNodeAdapter,
  yulFunctionDefinitionNodeAdapter,
  yulIdentifierNodeAdapter,
  yulIfNodeAdapter,
  yulLiteralNodeAdapter,
  yulTypedNameNodeAdapter,
} from '../../yulNodes.adapters'

import { createYulNodesStructure } from './createYulNodesStructure.saga'

const MOCK_CONTRACT_ADDRESS = '0x213'
const MOCK_YUL_CONTENT: TYulBlock = {
  statements: [],
  src: '10:20:20',
  nodeType: NodeType.YulBlock,
}

const MOCK_PARSED_YUL_BLOCK: TParsedYulBlock = {
  statements: [],
  src: '10:20',
  nodeType: NodeType.YulBlock,
}

const MOCK_CONVERT_YUL_RESULT = {
  yulTypedNames: [],
  yulNodesLinkArray: [],
  yulNodes: [],
  yulNodeBlocks: [MOCK_PARSED_YUL_BLOCK],
  yulNodeAssignments: [],
  yulLiterals: [],
  yulIfs: [],
  yulIdentifiers: [],
  yulFunctionDefinitions: [],
  yulFunctionCalls: [],
  yulForLoops: [],
  yulExpressionStatements: [],
}

describe('createYulNodesStructureSaga', () => {
  it('should create yulnodes structure', async () => {
    const initialState = {
      [StoreKeys.YUL_NODES]: yulNodesInitialState,
    }

    const expectedState = {
      ...initialState,
      [StoreKeys.YUL_NODES]: {
        [MOCK_CONTRACT_ADDRESS]: {
          yulVariableDeclarations: yulBaseNodeAdapter.getInitialState(),
          yulTypedNames: yulTypedNameNodeAdapter.getInitialState(),
          yulNodes: yulBaseNodeAdapter.getInitialState(),
          yulLiterals: yulLiteralNodeAdapter.getInitialState(),
          yulIfs: yulIfNodeAdapter.getInitialState(),
          yulIdentifiers: yulIdentifierNodeAdapter.getInitialState(),
          yulFunctionDefinitions: yulFunctionDefinitionNodeAdapter.getInitialState(),
          yulFunctionCalls: yulFunctionCallNodeAdapter.getInitialState(),
          yulForLoops: yulForLoopNodeAdapter.getInitialState(),
          yulExpressionStatements: yulExpressionStatementNodeAdapter.getInitialState(),
          yulBlocks: yulBlockNodeAdapter.addOne(yulBlockNodeAdapter.getInitialState(), MOCK_PARSED_YUL_BLOCK),
          yulAssignments: yulAssignmentNodeAdapter.getInitialState(),
          address: MOCK_CONTRACT_ADDRESS,
        },
      },
    }

    const { storeState } = await expectSaga(
      createYulNodesStructure,
      yulNodesActions.createYulNodesStructure({
        content: MOCK_YUL_CONTENT,
        address: MOCK_CONTRACT_ADDRESS,
      }),
    )
      .withReducer(combineReducers({ [StoreKeys.YUL_NODES]: yulNodesReducer }))
      .withState(initialState)
      .provide([[matchers.call.fn(convertYulTreeToArray), MOCK_CONVERT_YUL_RESULT]])
      .call(convertYulTreeToArray, MOCK_YUL_CONTENT)
      .put(yulNodesActions.initializeYulNodesForContract({ address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulExpressionStatements({ yulExpressionStatements: [], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulForLoops({ yulForLoops: [], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulFunctionCalls({ yulFunctionCalls: [], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulFunctionDefinitions({ yulFunctionDefinitions: [], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulIdentifiers({ yulIdentifiers: [], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulIfs({ yulIfs: [], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulLiterals({ yulLiterals: [], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulAssignments({ yulAssignments: [], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulBlocks({ yulBlocks: [MOCK_PARSED_YUL_BLOCK], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulTypedNames({ yulTypedNames: [], address: MOCK_CONTRACT_ADDRESS }))
      .put(yulNodesActions.addYulNodes({ yulNodes: [], address: MOCK_CONTRACT_ADDRESS }))
      .run()

    expect(storeState).toEqual(expectedState)
  })
})
