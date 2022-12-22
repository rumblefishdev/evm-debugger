import type { NavigateFunction, RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { MainDisplay } from './pages/MainDisplay'
import { SelectTransactionScreen } from './pages/SelectTransactionScreen'
import { StructlogsExplorer } from './pages/StructlogsExplorer'

export const routes: RouteObject[] = [
  {
    path: '/',
    loader: () => import('./pages/SelectTransactionScreen'),
    element: <SelectTransactionScreen />,
  },
  {
    path: '/mainDisplay',
    loader: () => import('./pages/MainDisplay'),
    element: <MainDisplay />,
  },
  {
    path: '/summary',
    loader: () => import('./pages/AnalyzeSummary'),
    element: <AnalyzeSummary />,
  },
  {
    path: '/structlogsExplorer',
    loader: () => import('./pages/StructlogsExplorer'),
    element: <StructlogsExplorer />,
  },
]

export type TPaths = '/' | '/mainDisplay' | '/summary' | '/structlogsExplorer'

export const router = createBrowserRouter(routes, { basename: process.env.PUBLIC_URL })

export const typedNavigate = (navigate: NavigateFunction, path: TPaths) => {
  navigate(path)
}
