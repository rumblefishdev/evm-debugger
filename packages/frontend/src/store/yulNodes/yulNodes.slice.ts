import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

import type { TYulNodeState } from './yulNodes.types'

export const yulNodesAdapter = createEntityAdapter<TYulNodeState>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const yulNodesSlice = createSlice({
  reducers: {
    addYulNodes: yulNodesAdapter.addMany,
    addYulNode: yulNodesAdapter.addOne,
  },
  name: StoreKeys.YUL_NODES,
  initialState: yulNodesAdapter.getInitialState(),
})

export const yulNodesActions = yulNodesSlice.actions
export const yulNodesReducer = yulNodesSlice.reducer
export const yulNodeAdapterSelectors = yulNodesAdapter.getSelectors()

export type TYulNodesActions = typeof yulNodesActions
