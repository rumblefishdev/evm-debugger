export interface IFluidSize {
  minSize: number
  maxSize: number
  increase?: boolean
  maxBp?: number
  minBp?: number
}

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

export const fluidSize = ({ minSize, maxSize, increase, maxBp, minBp }: IFluidSize) => {
  const minBreakpoint = minBp
  const maxBreakpoint = maxBp

  if (increase)
    return `calc(${maxSize}px - (${maxSize} - ${minSize}) * ((100vw - ${minBreakpoint}px) / (${maxBreakpoint} - ${minBreakpoint} )))`

  return `calc(${minSize}px + (${maxSize} - ${minSize}) * ((100vw - ${minBreakpoint}px) / (${maxBreakpoint} - ${minBreakpoint} )))`
}
