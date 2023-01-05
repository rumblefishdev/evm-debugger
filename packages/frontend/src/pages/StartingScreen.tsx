import React from 'react'
import { Outlet } from 'react-router-dom'

import { Layout } from '../parts/StartingScreen/Layout'
import { Navigation } from '../parts/StartingScreen/Navigation'

export const StartingScreen: () => JSX.Element = () => (
  <Layout>
    <Navigation>
      <Outlet />
    </Navigation>
  </Layout>
)
