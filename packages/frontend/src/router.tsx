import type { NavigateFunction, RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import { AnalyzerProgressScreen } from './pages/AnalyzerProgressScreen'
import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { SelectTransactionScreen } from './pages/SelectTransactionScreen'
import { StructlogsExplorer } from './pages/StructlogsExplorer'
import { TranscationScreen } from './pages/TranscationScreen'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <SelectTransactionScreen />,
  },
  {
    path: '/transactionScreen',
    element: <TranscationScreen />,
  },
  {
    path: '/dataManager',
    element: <AnalyzeSummary />,
  },
  {
    path: '/structlogsExplorer',
    element: <StructlogsExplorer />,
  },
  {
    path: '/analyzerProgressScreen',
    element: <AnalyzerProgressScreen />,
  },
]

export type TPaths =
  | '/'
  | '/transactionScreen'
  | '/dataManager'
  | '/structlogsExplorer'
  | '/analyzerProgressScreen'

export const router = createBrowserRouter(routes, {
  basename: process.env.PUBLIC_URL,
})

export const typedNavigate = (navigate: NavigateFunction, path: TPaths) => {
  navigate(path)
}
