import type { NavigateFunction, RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { GasTreeMap } from './pages/GasTreeMap'
import { SelectTransactionScreen } from './pages/SelectTransactionScreen'
import { StructlogsExplorer } from './pages/StructlogsExplorer'
import { TracelogInformation } from './pages/TracelogInformation'

export const routes: RouteObject[] = [
  {
    path: '/',
    loader: () => import('./pages/SelectTransactionScreen'),
    element: <SelectTransactionScreen />,
  },
  {
    path: '/gasTreeMap',
    loader: () => import('./pages/GasTreeMap'),
    element: <GasTreeMap />,
  },
  {
    path: '/tracelogInformation',
    loader: () => import('./pages/TracelogInformation'),
    element: <TracelogInformation />,
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
  | '/gasTreeMap'
  | '/tracelogInformation'
  | '/dataManager'
  | '/structlogsExplorer'

export const router = createBrowserRouter(routes, {
  basename: process.env.PUBLIC_URL,
})

export const typedNavigate = (navigate: NavigateFunction, path: TPaths) => {
  navigate(path)
}
