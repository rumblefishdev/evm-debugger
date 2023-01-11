type CmsOptimized = {
  url: string
  quality?: number
  width?: number
  height?: number
}

// This will return url with additional tags, for images in lower quality and size
// https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation/quality
// https://www.contentful.com/developers/docs/references/images-api/#/reference/resizing-&-cropping/change-the-resizing-behavior

export const getCmsOptimizedUrl = ({
  url,
  quality = 60,
  width,
  height,
}: CmsOptimized): string => {
  let baseUrl = `${url}?fm=jpg&q=${quality}`

  if (width) baseUrl += `&w=${width.toString(10)}`

  if (height) baseUrl += `&h=${height.toString(10)}`

  if (width || height) baseUrl += '&fit=pad'

  return baseUrl
}
