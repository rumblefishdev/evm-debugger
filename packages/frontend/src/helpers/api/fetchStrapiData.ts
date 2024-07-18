const checkEmbeddedBlogPosts = (element, data) => {
  if (!element.attributes) return element

  const embedded = element.attributes.embeddedInRichText

  if (!embedded || embedded.blog_posts?.data.length === 0) return element

  const newData = embedded.blog_posts?.data.map((blogPost) => {
    const relatedBlogPost = data.find((x) => x.id === blogPost.id)
    if (relatedBlogPost) return checkEmbeddedBlogPosts(relatedBlogPost, data)
  })

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
      },
    },
  }
}

export const fetchBlogPosts = async () => {
  const file = await import('../../data/blogPosts.json')

  const fetchedData = file.data.blogPosts.data
  return fetchedData.map((element) => {
    return checkEmbeddedBlogPosts(element, fetchedData)
  })
}
