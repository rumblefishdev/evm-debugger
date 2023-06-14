import { useLoaderData } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useRef } from 'react'

import type { IBlogPost } from '../../importedComponents/contentful-ui.types'
import { Header, Footer } from '../../importedComponents'
import { themeNavy } from '../../theme/algaeTheme'

import { DebuggerFormSection } from './DebuggerFormSection'
import { AnalyzeTransactionSection } from './AnalyzeTransactionSection'
import { OnlyDebuggerYouNeedSection } from './OnlyDebuggerYouNeedSection'
import { Manual } from './Manual'
import { Supported } from './Supported'

export const ManualUpload: () => JSX.Element = () => <Manual />

export const SupportedChain: () => JSX.Element = () => <Supported />

export const StartingScreen: () => JSX.Element = () => {
  const { blogPosts } = useLoaderData() as { blogPosts: IBlogPost[] }
  const offerRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <ThemeProvider theme={themeNavy}>
        <CssBaseline>
          <Header
            blogs={blogPosts}
            background={'transparent'}
          />
          <DebuggerFormSection ref={offerRef} />
          <OnlyDebuggerYouNeedSection ref={offerRef} />
          <AnalyzeTransactionSection />

          <Footer />
        </CssBaseline>
      </ThemeProvider>
    </>
  )
}
