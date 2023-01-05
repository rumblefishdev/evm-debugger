import { createBrowserRouter } from 'react-router-dom'

import { SupportedChain } from './pages/SupportedChain'
import { ManualUpload } from './pages/ManualUpload'
import { AnalyzerProgressScreen } from './pages/AnalyzerProgressScreen'
import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { StructlogsExplorer } from './pages/StructlogsExplorer'
import { TranscationScreen } from './pages/TranscationScreen'
import { AppNavigation } from './parts/AppNavigation'
import { StartingScreen } from './pages/StartingScreen'

export enum ROUTES {
  HOME = '/',
  SUPPORTED_CHAIN = '/supportedChain',
  MANUAL_UPLOAD = '/manualUpload',
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
      element: <StartingScreen />,
      children: [
        {
          path: ROUTES.SUPPORTED_CHAIN,
          element: <SupportedChain />,
        },
        {
          path: ROUTES.MANUAL_UPLOAD,
          element: <ManualUpload />,
        },
      ],
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
