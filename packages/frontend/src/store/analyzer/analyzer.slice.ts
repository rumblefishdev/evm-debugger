import { createAction } from '@reduxjs/toolkit'

import type { IRunAnalyzerPayload } from './analyzer.types'

export const analyzerActions = {
  runAnalyzer: createAction<IRunAnalyzerPayload>('analyzer/runAnalyzer'),
}
