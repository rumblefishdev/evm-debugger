import type { NavigateFunction, RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { SelectTransactionScreen } from './pages/SelectTransactionScreen'
import { StructlogsExplorer } from './pages/StructlogsExplorer'
import { TranscationScreen } from './pages/TranscationScreen'

export const routes: RouteObject[] = [
  {
    path: '/',
    loader: () => import('./pages/SelectTransactionScreen'),
    element: <SelectTransactionScreen />,
  },
  {
    path: '/transactionScreen',
    loader: () => import('./pages/TranscationScreen'),
    element: <TranscationScreen />,
  },
  {
    path: '/dataManager',
    loader: () => import('./pages/AnalyzeSummary'),
    element: <AnalyzeSummary />,
  },
  {
    path: '/structlogsExplorer',
    loader: () => import('./pages/StructlogsExplorer'),
    element: <StructlogsExplorer />,
  },
]

export type TPaths =
  | '/'
  | '/transactionScreen'
  | '/dataManager'
  | '/structlogsExplorer'

export const router = createBrowserRouter(routes, {
  basename: process.env.PUBLIC_URL,
})

export const typedNavigate = (navigate: NavigateFunction, path: TPaths) => {
  navigate(path)
}
