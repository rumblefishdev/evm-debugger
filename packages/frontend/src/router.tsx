import { createBrowserRouter } from 'react-router-dom'

import { SelectTransactionScreen } from './pages/SelectTransactionScreen'
import { AnalyzerProgressScreen } from './pages/AnalyzerProgressScreen'
import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { StructlogsExplorer } from './pages/StructlogsExplorer'
import { TranscationScreen } from './pages/TranscationScreen'
import { AppNavigation } from './parts/AppNavigation'

export enum ROUTES {
  HOME = '/',
  APP = '/app',
  TRANSACTION_SCREEN = '/app/transactionScreen',
  DATA_MANAGER = '/app/dataManager',
  STRUCTLOGS_EXPLORER = '/app/structlogsExplorer',
  ANALYZER_PROGRESS_SCREEN = '/analyzerProgressScreen',
}

export const appRouter = createBrowserRouter(
  [
    {
      path: ROUTES.HOME,
      element: <SelectTransactionScreen />,
    },
    {
      path: ROUTES.ANALYZER_PROGRESS_SCREEN,
      element: <AnalyzerProgressScreen />,
    },
    {
      path: ROUTES.APP,
      element: <AppNavigation />,
      children: [
        {
          path: ROUTES.TRANSACTION_SCREEN,
          element: <TranscationScreen />,
        },
        {
          path: ROUTES.DATA_MANAGER,
          element: <AnalyzeSummary />,
        },
        {
          path: ROUTES.STRUCTLOGS_EXPLORER,
          element: <StructlogsExplorer />,
        },
      ],
    },
  ],
  {
    basename: process.env.PUBLIC_URL,
  }
)
