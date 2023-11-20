import { createBrowserRouter } from 'react-router-dom'

import { StartingScreen, SupportedChain, AnalyzeSummary, AnalyzerProgressScreen, TranscationScreen } from './pages'
import { AppNavigation } from './pages/AppNavigation'
import { ROUTES as ORIG_ROUTES } from './routes'
import { TransactionExplorer } from './pages/TransactionExplorer/TransactionExplorer'

export const ROUTES = ORIG_ROUTES

export const appRouter = createBrowserRouter(
  [
    {
      path: ROUTES.HOME,
      element: <StartingScreen />,
      children: [
        {
          path: ROUTES.HOME,
          element: <SupportedChain />,
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
          element: (
            <AnalyzerProgressScreen>
              <TranscationScreen />
            </AnalyzerProgressScreen>
          ),
        },
        {
          path: ROUTES.DATA_MANAGER,
          element: (
            <AnalyzerProgressScreen>
              <AnalyzeSummary />
            </AnalyzerProgressScreen>
          ),
        },
        {
          path: ROUTES.TRANSACTION_EXPLORER,
          element: (
            <AnalyzerProgressScreen>
              <TransactionExplorer />
            </AnalyzerProgressScreen>
          ),
        },
      ],
    },
  ],
  {
    basename: process.env.PUBLIC_URL,
  },
)
