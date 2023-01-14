import { createBrowserRouter } from 'react-router-dom'

import {
  ManualUpload,
  StartingScreen,
  SupportedChain,
  AnalyzeSummary,
  AnalyzerProgressScreen,
  StructlogsExplorer,
  TranscationScreen,
} from './pages'
import { AppNavigation } from './pages/AppNavigation'

export enum ROUTES {
  HOME = '/',
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
      loader: async () => {
        const entries = await contentfulClient.getEntries({
          order: '-fields.pubDate',
          content_type: 'blogPost',
        })

        return { blogPosts: entries.items }
      }
      element: <StartingScreen />,
      children: [
        {
          path: ROUTES.HOME,
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
=======
import { contentfulClient } from './importedComponents'
import { AnalyzerProgressScreen } from './pages/AnalyzerProgressScreen'
import { AnalyzeSummary } from './pages/AnalyzeSummary'
import { SelectTransactionScreen } from './pages/SelectTransactionScreen'
import { StructlogsExplorer } from './pages/StructlogsExplorer'
import { TranscationScreen } from './pages/TranscationScreen'

export const routes: RouteObject[] = [
  {
    path: '/',
    loader: async () => {
      const entries = await contentfulClient.getEntries({
        order: '-fields.pubDate',
        content_type: 'blogPost',
      })

      return entries.items
    },
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
>>>>>>> origin/117-import-header-footer
  {
    basename: process.env.PUBLIC_URL,
  },
)
