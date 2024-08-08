import { createBrowserRouter } from 'react-router-dom'

import { StartingScreen, AnalyzeSummary, TransactionScreen, AppRoot } from './pages'
import { ROUTES as ORIG_ROUTES } from './routes'
import { TransactionExplorer } from './pages/TransactionExplorer/TransactionExplorer.component'

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
          element: <TransactionExplorer />,
        },
        {
          path: ROUTES.REDIRECT_OLD,
          element: <TransactionExplorer />,
        },
        {
          path: ROUTES.DATA_MANAGER,
          element: <AnalyzeSummary />,
        },
        {
          path: ROUTES.TRANSACTION_EXPLORER,
          element: <TransactionScreen />,
        },
      ],
    },
  ],
  {
    basename: process.env.PUBLIC_URL,
  },
)
