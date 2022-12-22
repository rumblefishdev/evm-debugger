export const itemSpacePercentageByGasCost = (gasCost: number, parentGasCost: number) => {
  const MAX_SPACE = 100
  const ROUNDING = 0

  // eslint-disable-next-line no-magic-numbers
  return Number.parseInt(((gasCost / parentGasCost) * MAX_SPACE).toFixed(ROUNDING))
}

export const zoom = (event: WheelEvent, element: HTMLDivElement) => {
  const { deltaY } = event
  const { clientX, clientY } = event
  const transformValue = element.style.getPropertyValue('transform')
  const scaleValue = Number.parseInt(transformValue ? transformValue.split('(')[1].split(')')[0].split(',')[0] : '1', 10)

  if (deltaY >= 0 && scaleValue > 1) {
    // zoom out
    console.log('zoom out')
    element.style.setProperty('transform', `scale(${scaleValue - 1})`)
  }
  // zoom in
  if (deltaY <= 0) {
    console.log('zoom in')
    element.style.setProperty('transform', `scale(${scaleValue + 1})`)
    element.style.setProperty('transform-origin', `${clientX}px ${clientY}px`)
    element.style.setProperty('transform-box', 'fill-box')
  }
}

export const sumReducer = (accumulator: number, currentValue: number) => accumulator + currentValue
