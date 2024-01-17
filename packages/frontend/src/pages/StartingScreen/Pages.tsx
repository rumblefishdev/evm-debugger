import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useRef, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Header } from '@rumblefishdev/ui/lib/src/components/Rumblefish23Theme/Header'
import { Footer } from '@rumblefishdev/ui/lib/src/components/Rumblefish23Theme/Footer'
import { themeDark } from '@rumblefishdev/ui/lib/src/theme/rumblefish23Theme'
import { ThemeContextProvider } from '@rumblefishdev/ui/lib/context/themeContext/themeContext'

import FacebookLogo from '../../importedComponents/assets/socialDebuggerLogo.png'
import type { IBlogPost } from '../../importedComponents/contentful-ui.types'
import { contentfulClient } from '../../importedComponents'
import { themeNavy } from '../../theme/algaeTheme'
import { GAnalytics } from '../../components/GAnalytics'

import { DebuggerFormSection } from './DebuggerFormSection'
import { AnalyzeTransactionSection } from './AnalyzeTransactionSection'
import { OnlyDebuggerYouNeedSection } from './OnlyDebuggerYouNeedSection'

const isPrerender = process.env.REACT_APP_IS_PRERENDER === 'true'

const getPosts = async () => {
  const entries = await contentfulClient.getEntries({
    order: '-fields.pubDate',
    content_type: 'blogPost',
  })

  return { blogPosts: entries.items }
}

export const StartingScreen: () => JSX.Element = () => {
  const [fetchedBlogPosts, setFetchedBlogPosts] = useState([])
  useEffect(() => {
    if (isPrerender) return
    const fetchData = async () => {
      const { blogPosts } = (await getPosts()) as { blogPosts: IBlogPost[] }
      setFetchedBlogPosts(blogPosts)
    }
    fetchData().catch(console.error)
  }, [])

  const offerRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <Helmet>
        <meta
          property="og:image"
          content={FacebookLogo}
        />

        <meta
          property="og:image:type"
          content="image/png"
        />
        <meta
          property="og:image:width"
          content="1024"
        />
        <meta
          property="og:image:height"
          content="1024"
        />
      </Helmet>
      <ThemeContextProvider>
        <ThemeProvider theme={themeNavy}>
          <CssBaseline>
            <ThemeProvider theme={themeDark}>
              <Header
                blogPosts={[]}
                withoutThemeSwitch
                backgroundColor="rgba(7,29,90)"
              />
            </ThemeProvider>

            <GAnalytics />
            <DebuggerFormSection ref={offerRef} />
            <OnlyDebuggerYouNeedSection ref={offerRef} />
            <AnalyzeTransactionSection />
            <ThemeProvider theme={themeDark}>
              <Footer />
            </ThemeProvider>
          </CssBaseline>
        </ThemeProvider>
      </ThemeContextProvider>
    </>
  )
}
