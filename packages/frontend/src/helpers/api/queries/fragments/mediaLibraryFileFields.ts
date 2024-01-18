import { gql } from '@apollo/client'

export const mediaLibraryFileFields = gql`
  fragment mediaLibraryFileFields on UploadFileEntity {
    id
    attributes {
      name
      alternativeText
      caption
      width
      height
      formats
      hash
      ext
      mime
      size
      url
      previewUrl
      provider
      provider_metadata
    }
  }
`
