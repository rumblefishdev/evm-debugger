export const truncateText = (text: string, n: number) => {
  if (text.length <= n) return text

  const truncated = text.slice(0, Math.max(0, n))
  if (text.charAt(n) === ' ') return `${truncated}...`

  return `${truncated.slice(0, Math.max(0, truncated.lastIndexOf(' ')))}...`
}
export const removeDash = (text: string) => {
  return text.replace('-', ' ')
}
