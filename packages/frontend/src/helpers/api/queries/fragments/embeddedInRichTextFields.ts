import { gql } from '@apollo/client'

import { jobPostingFields } from './jobPostingFields'

export const embeddedInRichTextFields = gql`
  ${jobPostingFields}
  fragment embeddedInRichTextFields on ComponentGroupEmbedded {
    id
    code_snippets(pagination: { limit: 100 }) {
      data {
        attributes {
          body
          title
          language
        }
      }
    }
    images_grids(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          images {
            data {
              attributes {
                caption
                name
                url
              }
            }
          }
        }
      }
    }
    text_block_grids(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          blocks {
            data {
              attributes {
                header
                content
              }
            }
          }
        }
      }
    }
    case_study_testimonials(pagination: { limit: 100 }) {
      data {
        attributes {
          content
          title
          style
          author {
            data {
              attributes {
                Name
                Position
                Avatar {
                  data {
                    attributes {
                      caption
                      name
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    hubspot_forms(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          portalId
          formGuid
          successUrl
          submitText
        }
      }
    }
    download_buttons(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          label
          target {
            data {
              attributes {
                caption
                name
                url
              }
            }
          }
        }
      }
    }
    action_buttons(pagination: { limit: 100 }) {
      data {
        attributes {
          label
          anchorId
          top
        }
      }
    }
    image_sliders(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          images {
            data {
              attributes {
                caption
                name
                url
              }
            }
          }
        }
      }
    }
    images(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          width
          height
          align
          image {
            data {
              attributes {
                caption
                name
                url
              }
            }
          }
        }
      }
    }
    instagram_posts(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          posts {
            data {
              attributes {
                uri
              }
            }
          }
        }
      }
    }
    person_cards(pagination: { limit: 100 }) {
      data {
        attributes {
          email
          role
          linkedInProfile
          content
          description
          picture {
            data {
              attributes {
                width
                height
                align
                image {
                  data {
                    attributes {
                      caption
                      name
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    anchors(pagination: { limit: 100 }) {
      data {
        attributes {
          textId
        }
      }
    }
    icon_cards_collections(pagination: { limit: 100 }) {
      data {
        attributes {
          name
          items {
            data {
              attributes {
                title
                lg
                md
                sm
                xs
                image {
                  data {
                    attributes {
                      width
                      height
                      align
                      image {
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
              }
            }
          }
        }
      }
    }
    current_openings(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          jobPosting {
            data {
              ...jobPostingFields
            }
          }
        }
      }
    }
    tiles_collections(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          tiles {
            data {
              attributes {
                embeddedInRichText {
                  images {
                    data {
                      attributes {
                        title
                        image {
                          data {
                            attributes {
                              name
                              url
                            }
                          }
                        }
                        width
                        height
                        align
                      }
                    }
                  }
                }
                title
                content
                lg
                md
                sm
                sm
                xs
              }
            }
          }
        }
      }
    }
    link_images(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          image {
            data {
              attributes {
                caption
                name
                url
              }
            }
          }
          type
          url
          imagePlacement
          width
        }
      }
    }
    blog_posts(pagination: { limit: 100 }) {
      data {
        id
      }
    }
  }
`
