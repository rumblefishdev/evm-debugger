import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useRef, useEffect, useState } from 'react'

import type { IBlogPost } from '../../importedComponents/contentful-ui.types'
import { Header, Footer, contentfulClient } from '../../importedComponents'
import { themeNavy } from '../../theme/algaeTheme'

import { DebuggerFormSection } from './DebuggerFormSection'
import { AnalyzeTransactionSection } from './AnalyzeTransactionSection'
import { OnlyDebuggerYouNeedSection } from './OnlyDebuggerYouNeedSection'
import { Manual } from './Manual'
import { Supported } from './Supported'

const isPrerender = process.env.REACT_APP_IS_PRERENDER === 'true'

const getPosts = async () => {
  const entries = await contentfulClient.getEntries({
    order: '-fields.pubDate',
    content_type: 'blogPost',
  })

  return { blogPosts: entries.items }
}
export const ManualUpload: () => JSX.Element = () => <Manual />

export const SupportedChain: () => JSX.Element = () => <Supported />

export const StartingScreen: () => JSX.Element = () => {
  const [fetchedBlogPosts, setFetchedBlogPosts] = useState([])
  useEffect(() => {
    if (!isPrerender) return
    const fetchData = async () => {
      const { blogPosts } = (await getPosts()) as { blogPosts: IBlogPost[] }
      setFetchedBlogPosts(blogPosts)
    }
    fetchData().catch(console.error)
  }, [])

  const offerRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <ThemeProvider theme={themeNavy}>
        <CssBaseline>
          <Header
            blogs={fetchedBlogPosts}
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
