import { useLoaderData, Outlet } from 'react-router-dom'

import type { IBlogPost } from '../../importedComponents/contentful-ui.types'
import { Footer } from '../../importedComponents'

import { Manual } from './Manual'
import { Navigation } from './Navigation'
import { Supported } from './Supported'
import { Layout } from './Layout'

export const ManualUpload: () => JSX.Element = () => <Manual />

export const SupportedChain: () => JSX.Element = () => <Supported />

export const StartingScreen: () => JSX.Element = () => {
  const { blogPosts } = useLoaderData() as { blogPosts: IBlogPost[] }

  return (
    <>
      <Layout blogs={blogPosts}>
        <Navigation>
          <Outlet />
        </Navigation>
      </Layout>
    </>
  )
}
