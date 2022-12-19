import type { NavigateFunction, RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { MainDisplay } from './pages/MainDisplay'
import { SelectTransactionScreen } from './pages/SelectTransactionScreen'
import { StructlogsExplorer } from './pages/StructlogsExplorer'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <SelectTransactionScreen />,
  },
  {
    path: '/mainDisplay',
    element: <MainDisplay />,
  },
  {
    path: '/summary',
    element: <AnalyzeSummary />,
  },
  {
    path: '/structlogsExplorer',
    element: <StructlogsExplorer />,
  },
]

export type TPaths = '/' | '/mainDisplay' | '/summary' | '/structlogsExplorer'

export const router = createBrowserRouter(routes)

export const typedNavigate = (navigate: NavigateFunction, path: TPaths) => {
  navigate(path)
}
