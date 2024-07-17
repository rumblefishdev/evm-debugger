import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useRef, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { themes } from '../../theme/ui'
import '../../assets/css/fonts.css'
import { ThemeContextProvider } from '../../context/themeContext'
import FacebookLogo from '../../assets/png/socialDebuggerLogo.png'
import { GAnalytics } from '../../components/GAnalytics'
import { fetchBlogPosts } from '../../helpers/api/fetchStrapiData'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

import { DebuggerFormSection } from './DebuggerFormSection'
import { AnalyzeTransactionSection } from './AnalyzeTransactionSection'
import { OnlyDebuggerYouNeedSection } from './OnlyDebuggerYouNeedSection'

const { dark: themeDark, navy: themeNavy } = themes

export const StartingScreen: () => JSX.Element = () => {
  const [fetchedBlogPosts, setFetchedBlogPosts] = useState<unknown[]>(null)
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
