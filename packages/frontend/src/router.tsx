import { createBrowserRouter } from 'react-router-dom'

import { StartingScreen, AnalyzeSummary, TranscationScreen, AppRoot } from './pages'
import { ROUTES as ORIG_ROUTES } from './routes'
// import { TransactionExplorer } from './pages/TransactionExplorer/TransactionExplorer'
import { TransactionExplorerStaticGrid } from './pages/TransactionExplorer/TransactionExplorerStaticGrid'

export const ROUTES = ORIG_ROUTES

export const appRouter = createBrowserRouter(
  [
    {
      path: ROUTES.HOME,
      element: <StartingScreen />,
    },
    {
      path: ROUTES.APP,
      element: <AppRoot />,
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
          path: ROUTES.TRANSACTION_EXPLORER,
          element: <TransactionExplorerStaticGrid />,
        },
      ],
    },
  ],
  {
    basename: process.env.PUBLIC_URL,
  },
)
