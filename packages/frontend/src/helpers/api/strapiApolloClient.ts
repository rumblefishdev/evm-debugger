import { ApolloClient, InMemoryCache } from '@apollo/client'

export const assignStrapiClient = () => {
  return new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    headers: {
      authorization: process.env.REACT_APP_STRAPI_AUTH_TOKEN || '',
    },
    cache: new InMemoryCache(),
  })
}
