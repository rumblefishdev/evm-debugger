export type TDirection = 'left' | 'top' | 'right' | 'down';

const arrowHiddenMouseOn = {
  transform: 'translate(0px)',
};
const arrowVisibleMouseOff = {
  transform: 'translate(0px)',
  transition: 'none',
};

const generateArrowHiddenMouseOff = (direction: TDirection, pixels: string) => {
  switch (direction) {
    case 'top':
      return {
        transform: `translateY(${pixels})`,
        transition: 'none',
      };
    case 'right':
      return {
        transform: `translateX(-${pixels})`,
        transition: 'none',
      };
    case 'down':
      return {
        transform: `translateY(-${pixels})`,
        transition: 'none',
      };
    case 'left':
      return {
        transform: `translateX(${pixels})`,
        transition: 'none',
      };
  }
};
const generateArrowVisibleMouseOn = (direction: TDirection, pixels: string) => {
  switch (direction) {
    case 'top':
      return {
        transform: `translateY(-${pixels})`,
      };
    case 'right':
      return {
        transform: `translateX(${pixels})`,
      };
    case 'down':
      return {
        transform: `translateY(${pixels})`,
      };
    case 'left':
      return {
        transform: `translateX(-${pixels})`,
      };
  }
};

export const generateArrowAnimation = (
  direction: TDirection,
  pixels = '50px'
) => {
  const arrowVisibleMouseOn = generateArrowVisibleMouseOn(direction, pixels);
  const arrowHiddenMouseOff = generateArrowHiddenMouseOff(direction, pixels);

  return {
    arrowVisibleMouseOn,
    arrowVisibleMouseOff,
    arrowHiddenMouseOff,
    arrowHiddenMouseOn,
  };
};
