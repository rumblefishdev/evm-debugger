import type { CustomBlogPostEntity, CustomComponentGroupEmbedded } from '@rumblefishdev/ui/lib/src/customStrapiTypes'

const checkEmbeddedBlogPosts = (element: CustomBlogPostEntity, data: CustomBlogPostEntity[]): CustomBlogPostEntity => {
  if (!element.attributes) return element

  const embedded = element.attributes.embeddedInRichText

  if (!embedded || embedded.blog_posts?.data.length === 0) return element

  const newData = embedded.blog_posts?.data.map((blogPost) => {
    const relatedBlogPost: CustomBlogPostEntity | undefined = data.find((x) => x.id === blogPost.id)
    if (relatedBlogPost) return checkEmbeddedBlogPosts(relatedBlogPost, data)
  }) as CustomBlogPostEntity[]

  return {
    ...element,
    attributes: {
      ...element.attributes,
      embeddedInRichText: {
        ...element.attributes.embeddedInRichText,
        blog_posts: {
          ...element.attributes.embeddedInRichText?.blog_posts,
          data: newData,
        },
      } as CustomComponentGroupEmbedded,
    },
  }
}

export const fetchBlogPosts = async () => {
  const file = await import('../../data/blogPosts.json')

  const fetchedData = file.data.blogPosts.data as CustomBlogPostEntity[]
  return fetchedData.map((element) => {
    return checkEmbeddedBlogPosts(element, fetchedData)
  })
}
