import { ContentfulClient } from 'react-contentful'

export const contentfulClient = ContentfulClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  environment: process.env.REACT_APP_CONTENTFUL_ENVIRONMENT,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
})
