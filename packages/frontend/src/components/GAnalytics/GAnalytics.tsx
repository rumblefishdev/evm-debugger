import { useLocation } from 'react-router-dom'
import React from 'react'
import ReactGA from 'react-ga4'

import { ROUTES } from '../../routes'

const PROD_URL = 'www.rumblefish.dev'

const onProd = () => typeof window !== 'undefined' && window.location.hostname === PROD_URL
export const GAnalyticsInit = () => {
  if (onProd()) ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)
}

export const GAnalytics = () => {
  const location = useLocation()
  if (onProd())
    React.useEffect(() => {
      const path = `${ROUTES.BASE}${location.pathname}`
      ReactGA.set({ page: path })
    }, [location])

  return <div></div>
}
