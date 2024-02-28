import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { TYulBlock } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type {
  TAddYulNodesPayload,
  TInitializeYulNodesForContractPayload,
  TYulNodeState,
  TAddYulAssignmentsPayload,
  TAddYulBlocksPayload,
  TAddYulExpressionStatementsPayload,
  TAddYulForLoopsPayload,
  TAddYulFunctionCallsPayload,
  TAddYulFunctionDefinitionsPayload,
  TAddYulIdentifiersPayload,
  TAddYulIfsPayload,
  TAddYulLiteralsPayload,
  TAddYulTypedNamesPayload,
  TAddYulVariableDeclarationsPayload,
} from './yulNodes.types'
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

export const initialState: TYulNodeState = {}

export const yulNodesSlice = createSlice({
  reducers: {
    initializeYulNodesForContract: (state, { payload }: PayloadAction<TInitializeYulNodesForContractPayload>) => {
      state[payload.address] = {
        yulVariableDeclarations: yulVariableDeclarationNodeAdapter.getInitialState(),
        yulTypedNames: yulTypedNameNodeAdapter.getInitialState(),
        yulNodes: yulBaseNodeAdapter.getInitialState(),
        yulLiterals: yulLiteralNodeAdapter.getInitialState(),
        yulIfs: yulIfNodeAdapter.getInitialState(),
        yulIdentifiers: yulIdentifierNodeAdapter.getInitialState(),
        yulFunctionDefinitions: yulFunctionDefinitionNodeAdapter.getInitialState(),
        yulFunctionCalls: yulFunctionCallNodeAdapter.getInitialState(),
        yulForLoops: yulForLoopNodeAdapter.getInitialState(),
        yulExpressionStatements: yulExpressionStatementNodeAdapter.getInitialState(),
        yulBlocks: yulBlockNodeAdapter.getInitialState(),
        yulAssignments: yulAssignmentNodeAdapter.getInitialState(),
        address: payload.address,
      }
    },

    createYulNodesStructure: (state, action: PayloadAction<{ content: TYulBlock; address: string }>) => {},

    addYulVariableDeclarations: (state, { payload }: PayloadAction<TAddYulVariableDeclarationsPayload>) => {
      state[payload.address].yulVariableDeclarations = yulVariableDeclarationNodeAdapter.addMany(
        state[payload.address].yulVariableDeclarations,
        payload.yulVariableDeclarations,
      )
    },
    addYulTypedNames: (state, { payload }: PayloadAction<TAddYulTypedNamesPayload>) => {
      state[payload.address].yulTypedNames = yulTypedNameNodeAdapter.addMany(state[payload.address].yulTypedNames, payload.yulTypedNames)
    },
    addYulNodes: (state, { payload }: PayloadAction<TAddYulNodesPayload>) => {
      state[payload.address].yulNodes = yulBaseNodeAdapter.addMany(state[payload.address].yulNodes, payload.yulNodes)
    },
    addYulLiterals: (state, { payload }: PayloadAction<TAddYulLiteralsPayload>) => {
      state[payload.address].yulLiterals = yulLiteralNodeAdapter.addMany(state[payload.address].yulLiterals, payload.yulLiterals)
    },
    addYulIfs: (state, { payload }: PayloadAction<TAddYulIfsPayload>) => {
      state[payload.address].yulIfs = yulIfNodeAdapter.addMany(state[payload.address].yulIfs, payload.yulIfs)
    },
    addYulIdentifiers: (state, { payload }: PayloadAction<TAddYulIdentifiersPayload>) => {
      state[payload.address].yulIdentifiers = yulIdentifierNodeAdapter.addMany(
        state[payload.address].yulIdentifiers,
        payload.yulIdentifiers,
      )
    },
    addYulFunctionDefinitions: (state, { payload }: PayloadAction<TAddYulFunctionDefinitionsPayload>) => {
      state[payload.address].yulFunctionDefinitions = yulFunctionDefinitionNodeAdapter.addMany(
        state[payload.address].yulFunctionDefinitions,
        payload.yulFunctionDefinitions,
      )
    },
    addYulFunctionCalls: (state, { payload }: PayloadAction<TAddYulFunctionCallsPayload>) => {
      state[payload.address].yulFunctionCalls = yulFunctionCallNodeAdapter.addMany(
        state[payload.address].yulFunctionCalls,
        payload.yulFunctionCalls,
      )
    },
    addYulForLoops: (state, { payload }: PayloadAction<TAddYulForLoopsPayload>) => {
      state[payload.address].yulForLoops = yulForLoopNodeAdapter.addMany(state[payload.address].yulForLoops, payload.yulForLoops)
    },
    addYulExpressionStatements: (state, { payload }: PayloadAction<TAddYulExpressionStatementsPayload>) => {
      state[payload.address].yulExpressionStatements = yulExpressionStatementNodeAdapter.addMany(
        state[payload.address].yulExpressionStatements,
        payload.yulExpressionStatements,
      )
    },
    addYulBlocks: (state, { payload }: PayloadAction<TAddYulBlocksPayload>) => {
      state[payload.address].yulBlocks = yulBlockNodeAdapter.addMany(state[payload.address].yulBlocks, payload.yulBlocks)
    },
    addYulAssignments: (state, { payload }: PayloadAction<TAddYulAssignmentsPayload>) => {
      state[payload.address].yulAssignments = yulAssignmentNodeAdapter.addMany(
        state[payload.address].yulAssignments,
        payload.yulAssignments,
      )
    },
  },
  name: StoreKeys.YUL_NODES,
  initialState,
})

export const yulNodesActions = yulNodesSlice.actions
export const yulNodesReducer = yulNodesSlice.reducer

export type TYulNodesActions = ActionsType<typeof yulNodesActions>
