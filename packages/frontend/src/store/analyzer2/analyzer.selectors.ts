import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { analyzerStagesAdapter, analyzerLogMessagesAdapter } from './analyzer.state'

const analyzerStagesSelectors = analyzerStagesAdapter.getSelectors()
const analyzerLogMessagesSelectors = analyzerLogMessagesAdapter.getSelectors()

const selectAnalyzerState = createSelector([selectReducer(StoreKeys.ACTIVE_SOURCE_FILE)], (state) => state)

export const analyzerSelectors = {}
