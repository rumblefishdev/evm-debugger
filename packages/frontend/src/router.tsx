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
import { contentfulClient } from './importedComponents'
import { ContentMap } from './pages/TreeMap'

export enum ROUTES {
  HOME = '/',
  MANUAL_UPLOAD = '/manualUpload',
  APP = '/app',
  TRANSACTION_SCREEN = '/app/transactionScreen',
  DATA_MANAGER = '/app/dataManager',
  STRUCTLOGS_EXPLORER = '/app/structlogsExplorer',
  ANALYZER_PROGRESS_SCREEN = '/analyzerProgressScreen',
  TREE_MAP = '/app/treeMap',
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
      },
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
        {
          path: ROUTES.TREE_MAP,
          element: <ContentMap />,
        },
      ],
    },
  ],
  {
    basename: process.env.PUBLIC_URL,
  }
)
