const arrowHiddenMouseOn = {
  transform: 'translate(0px)',
}
const arrowVisibleMouseOff = {
  transition: 'none',
  transform: 'translate(0px)',
}

type TDirection = 'left' | 'top' | 'right' | 'down'

const generateArrowHiddenMouseOff = (direction: TDirection, pixels: string) => {
  switch (direction) {
    case 'top':
      return {
        transition: 'none',
        transform: `translateY(${pixels})`,
      }
    case 'right':
      return {
        transition: 'none',
        transform: `translateX(-${pixels})`,
      }
    case 'down':
      return {
        transition: 'none',
        transform: `translateY(-${pixels})`,
      }
    case 'left':
      return {
        transition: 'none',
        transform: `translateX(${pixels})`,
      }
    default:
      throw new Error('Invalid direction')
  }
}
const generateArrowVisibleMouseOn = (direction: TDirection, pixels: string) => {
  switch (direction) {
    case 'top':
      return {
        transform: `translateY(-${pixels})`,
      }
    case 'right':
      return {
        transform: `translateX(${pixels})`,
      }
    case 'down':
      return {
        transform: `translateY(${pixels})`,
      }
    case 'left':
      return {
        transform: `translateX(-${pixels})`,
      }
    default:
      throw new Error('Invalid direction')
  }
}

export type { TDirection }

export const generateArrowAnimation = (direction: TDirection, pixels = '50px') => {
  const arrowVisibleMouseOn = generateArrowVisibleMouseOn(direction, pixels)
  const arrowHiddenMouseOff = generateArrowHiddenMouseOff(direction, pixels)

  return {
    arrowVisibleMouseOn,
    arrowVisibleMouseOff,
    arrowHiddenMouseOn,
    arrowHiddenMouseOff,
  }
}
