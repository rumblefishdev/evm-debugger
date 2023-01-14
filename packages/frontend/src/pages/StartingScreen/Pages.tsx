import { Outlet } from 'react-router-dom'

import { Manual } from './Manual'
import { Navigation } from './Navigation'
import { Supported } from './Supported'
import { Layout } from './Layout'

export const ManualUpload: () => JSX.Element = () => <Manual />

export const SupportedChain: () => JSX.Element = () => <Supported />

export const StartingScreen: () => JSX.Element = () => (
  <Layout>
    <Navigation>
      <Outlet />
    </Navigation>
  </Layout>
)
