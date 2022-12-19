import type { NavigateFunction, RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { MainDisplay } from './pages/MainDisplay'
import { SelectTransactionScreen } from './pages/SelectTransactionScreen'

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
]

export type TPaths = '/' | '/mainDisplay' | '/summary'

export const router = createBrowserRouter(routes, { basename: process.env.PUBLIC_URL })

export const typedNavigate = (navigate: NavigateFunction, path: TPaths) => {
  navigate(path)
}
