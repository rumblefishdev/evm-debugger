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

export enum ROUTES {
  BASE = 'evmDebugger',
  HOME = '/',
  MANUAL_UPLOAD = '/manualUpload',
  APP = '/tx',
  TRANSACTION_SCREEN = '/tx/:chainId/:txHash',
  TRANSACTION_SCREEN_MANUAL = '/tx/manual',
  DATA_MANAGER = '/tx/:chainId/:txHash/dataManager',
  DATA_MANAGER_MANUAL = '/tx/manual/dataManager',
  STRUCTLOGS_EXPLORER = '/tx/:chainId/:txHash/structlogsExplorer',
  STRUCTLOGS_EXPLORER_MANUAL = '/tx/manual/structlogsExplorer',
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
          element: (
            <AnalyzerProgressScreen>
              <TranscationScreen />
            </AnalyzerProgressScreen>
          ),
        },
        {
          path: ROUTES.DATA_MANAGER,
          element: (
            <AnalyzerProgressScreen>
              <AnalyzeSummary />
            </AnalyzerProgressScreen>
          ),
        },
        {
          path: ROUTES.STRUCTLOGS_EXPLORER,
          element: (
            <AnalyzerProgressScreen>
              <StructlogsExplorer />
            </AnalyzerProgressScreen>
          ),
        },
      ],
    },
  ],
  {
    basename: process.env.PUBLIC_URL,
  },
)
