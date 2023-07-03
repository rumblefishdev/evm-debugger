export const fluidFont = (min: number, max: number) => {
  return `calc(${min}px + (${max} - ${min}) * ((100vw - 320px) / (1136 - 320)))`
}
export const isMobile = () => {
  return global.innerWidth <= 960
}

export const handleFetchErrors = (response: { ok: boolean; statusText: string }) => {
  if (!response.ok) throw new Error(response.statusText)
  return response
}
