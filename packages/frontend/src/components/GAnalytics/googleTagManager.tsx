// import Script from 'next/script'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: Record<string, any>
  }
}

export const changeGTagPageview = () => {
  if (window.dataLayer === undefined) return
  window.dataLayer.push({
    page: new URL(window.location.href),
    event: 'pageview',
  })
}

export const GoogleTagManager = () => {
  const location = useLocation()
  useEffect(() => {
    changeGTagPageview()
  }, [location])
  return (
    <Helmet>
      <script>{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID}');
          `}</script>
    </Helmet>
  )
}
