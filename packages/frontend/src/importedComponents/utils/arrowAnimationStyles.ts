const arrowHiddenMouseOn = {
  transform: 'translate(0px)',
}
const arrowVisibleMouseOff = {
  transition: 'none',
  transform: 'translate(0px)',
}
// eslint-disable-next-line import/exports-last
export type TDirection = 'left' | 'top' | 'right' | 'down'

const generateArrowHiddenMouseOff = (direction: TDirection, pixels: string) => {
  switch (direction) {
    case 'top': {
      return {
        transition: 'none',
        transform: `translateY(${pixels})`,
      }
    }
    case 'right': {
      return {
        transition: 'none',
        transform: `translateX(-${pixels})`,
      }
    }
    case 'down': {
      return {
        transition: 'none',
        transform: `translateY(-${pixels})`,
      }
    }
    case 'left': {
      return {
        transition: 'none',
        transform: `translateX(${pixels})`,
      }
    }
    default: {
      return { transition: 'none' }
    }
  }
}
const generateArrowVisibleMouseOn = (direction: TDirection, pixels: string) => {
  switch (direction) {
    case 'top': {
      return {
        transform: `translateY(-${pixels})`,
      }
    }
    case 'right': {
      return {
        transform: `translateX(${pixels})`,
      }
    }
    case 'down': {
      return {
        transform: `translateY(${pixels})`,
      }
    }
    case 'left': {
      return {
        transform: `translateX(-${pixels})`,
      }
    }
    default: {
      return { transform: 'translateX(0px)' }
    }
  }
}

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
