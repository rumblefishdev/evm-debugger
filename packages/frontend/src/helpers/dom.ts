export function getScrollParent(element: HTMLElement): HTMLElement | null {
  if (element.parentElement) {
    if (element.parentElement.scrollHeight > element.parentElement.clientHeight)
      return element.parentElement

    return getScrollParent(element.parentElement)
  }

  return null
}

export function isInView(element: HTMLElement): boolean {
  const scrollParent = getScrollParent(element) ?? document.body

  const parentRect = scrollParent.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()

  const parentTop = parentRect.top
  const elementTop = elementRect.top
  const elementBottom = elementRect.bottom
  const parentBottom = parentRect.bottom

  return elementTop >= parentTop && elementBottom <= parentBottom
}
