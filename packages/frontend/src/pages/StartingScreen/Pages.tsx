import { useLoaderData, Outlet } from 'react-router-dom'

import { Header } from '../../importedComponents'

import { Manual } from './Manual'
import { Navigation } from './Navigation'
import { Supported } from './Supported'
import { Layout } from './Layout'

export const ManualUpload: () => JSX.Element = () => <Manual />

export const SupportedChain: () => JSX.Element = () => <Supported />

export const StartingScreen: () => JSX.Element = () => {
  const { blogPosts } = useLoaderData() as { blogPosts: any[] }

  return (
    <>
      <Header blogs={blogPosts} />
      <Layout>
        <Navigation>
          <Outlet />
        </Navigation>
      </Layout>
    </>
  )
}
