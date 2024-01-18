import { gql } from '@apollo/client'

import { embeddedInRichTextFields } from './fragments/embeddedInRichTextFields'

export const fetchBlogPostsQuery = gql`
  ${embeddedInRichTextFields}
  query getBlogPosts {
    blogPosts(sort: "createdAt:desc", pagination: { limit: 100 }) {
      data {
        id
        attributes {
          title
          slug
          pubDate
          authors {
            data {
              attributes {
                Name
                Position
                Avatar {
                  data {
                    attributes {
                      url
                      caption
                      name
                    }
                  }
                }
              }
            }
          }
          image {
            data {
              attributes {
                caption
                name
                url
              }
            }
          }
          thumbnail {
            data {
              attributes {
                caption
                name
                url
              }
            }
          }
          imageFitContain
          facebookImage {
            data {
              attributes {
                caption
                name
                url
              }
            }
          }
          timeToRead
          content
          shortContent
          category {
            name
          }
          homePageTag {
            data {
              attributes {
                tag
              }
            }
          }
          embeddedInRichText {
            ...embeddedInRichTextFields
          }
        }
      }
    }
  }
`
