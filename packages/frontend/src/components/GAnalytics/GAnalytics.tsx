import { useLocation } from 'react-router-dom'
import React from 'react'
import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'

import { ROUTES } from '../../router'

const PROD_URL = 'www.rumblefish.dev'

const onProd = () => typeof window !== 'undefined' && window.location.hostname === PROD_URL
export const GAnalyticsInit = () => {
  if (onProd()) {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)
    TagManager.initialize({ gtmId: process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID })
  }
}

export const GAnalytics = () => {
  const location = useLocation()
  if (onProd())
    React.useEffect(() => {
      const path = `${ROUTES.BASE}${location.pathname}`
      ReactGA.set({ page: path })
      ReactGA.pageview(path)
    }, [location])

  return <div></div>
}