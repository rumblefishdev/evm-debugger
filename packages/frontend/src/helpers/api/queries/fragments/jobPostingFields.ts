import { gql } from '@apollo/client'

import { mediaLibraryFileFields } from './mediaLibraryFileFields'

export const jobPostingFields = gql`
  ${mediaLibraryFileFields}
  fragment jobPostingFields on JobPostingEntity {
    id
    attributes {
      title
      slug
      salary
      team
      location
      icon {
        data {
          ...mediaLibraryFileFields
        }
      }
      facebookImage {
        data {
          ...mediaLibraryFileFields
        }
      }
      jobPage {
        data {
          id
          attributes {
            jobTitleInfo
            jobTitle
            ribbon {
              data {
                ...mediaLibraryFileFields
              }
            }
            salary
            ourOfferAlsoIncludeList(sort: "createdAt:asc", pagination: { limit: 100 }) {
              data {
                id
                attributes {
                  headline
                  icon {
                    data {
                      ...mediaLibraryFileFields
                    }
                  }
                  description
                }
              }
            }
            aFewWordsDescription
            howWeRecruitList(sort: "createdAt:asc", pagination: { limit: 100 }) {
              data {
                id
                attributes {
                  headline
                  description
                  number
                }
              }
            }
            technologiesList {
              id
              name
            }
            greatIfYouKnowList {
              id
              name
            }
            importantTraitsList {
              id
              name
            }
            whatYouWillDo {
              id
              name
            }
            howWeWorkList {
              id
              name
            }
          }
        }
      }
    }
  }
`
