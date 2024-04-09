import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useRef, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Header } from '@rumblefishdev/ui/lib/src/components/Rumblefish23Theme/Header'
import { Footer } from '@rumblefishdev/ui/lib/src/components/Rumblefish23Theme/Footer'
import { themeDark } from '@rumblefishdev/ui/lib/src/theme/rumblefish23Theme'
import { themeNavy } from '@rumblefishdev/ui/lib/src/theme/algaeTheme'
import { ThemeContextProvider } from '@rumblefishdev/ui/lib/context/themeContext/themeContext'
import type { CustomBlogPostEntity } from '@rumblefishdev/ui/lib/src/customStrapiTypes'

import '@rumblefishdev/ui/lib/src/assets/fonts.css'

import FacebookLogo from '../../assets/png/socialDebuggerLogo.png'
import { GAnalytics } from '../../components/GAnalytics'
import { fetchBlogPosts } from '../../helpers/api/fetchStrapiData'

import { DebuggerFormSection } from './DebuggerFormSection'
import { AnalyzeTransactionSection } from './AnalyzeTransactionSection'
import { OnlyDebuggerYouNeedSection } from './OnlyDebuggerYouNeedSection'

export const StartingScreen: () => JSX.Element = () => {
  const [fetchedBlogPosts, setFetchedBlogPosts] = useState<CustomBlogPostEntity[]>(null)
  useEffect(() => {
    const fetchData = async () => {
      const blogPosts = await fetchBlogPosts()
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
                blogPosts={fetchedBlogPosts}
                withoutThemeSwitch
                useSolidColorLogo
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
