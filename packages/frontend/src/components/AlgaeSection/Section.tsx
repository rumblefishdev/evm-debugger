import type { StyledComponentProps } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import React from 'react';
import type { SectionProps, TSpacingType } from './Section.types';

const PREFIX = 'Section';

const classes = {
  root: `${PREFIX}-root`,
  narrowStyle: `${PREFIX}-narrowStyle`,
  topOverlay: `${PREFIX}-topOverlay`,
  grayBg: `${PREFIX}-grayBg`,
  blueBg: `${PREFIX}-blueBg`,
  darkBlueBg: `${PREFIX}-darkBlueBg`,
  noneBg: `${PREFIX}-noneBg`,
  relative: `${PREFIX}-relative`,
  content: `${PREFIX}-content`,
  spacingSmall: `${PREFIX}-spacingSmall`,
  noLeftPadding: `${PREFIX}-noLeftPadding`,
  noRightPadding: `${PREFIX}-noRightPadding`,
  noTopPadding: `${PREFIX}-noTopPadding`,
  noBottomPadding: `${PREFIX}-noBottomPadding`,
};

const Root = styled('section')(
  ({
    theme: {
      spacing,
      breakpoints,
    },
  }) => ({
    [`&.${classes.root}`]: {
      display: 'grid',
      backgroundColor: 'transparent',
      gridTemplateColumns: `1fr minmax(0, 70rem) 1fr`,
      padding: spacing(10, 5),
      [breakpoints.only('xs')]: {
        padding: spacing(10, 2),
      },
    },

    [`&.${classes.narrowStyle}`]: {
      gridTemplateColumns: `1fr minmax(0, 48rem) 1fr`,
    },

    [`&.${classes.topOverlay}`]: {
      marginTop: `-${spacing(3)}`,
      padding: spacing(0, 5, 10),

      [breakpoints.down('md')]: {
        marginTop: 0,
      },
      [breakpoints.only('xs')]: {
        padding: spacing(10, 2),
      },
    },

    [`&.${classes.grayBg}`]: {
      backgroundColor: '#F8F8F9',
    },

    [`&.${classes.relative}`]: {
      position: 'relative',
    },

    [`&.${classes.blueBg}`]: {
      backgroundColor: '#01196F',
    },

    [`&.${classes.darkBlueBg}`]: {
      backgroundColor: '#1E2234',
    },
    [`&.${classes.noneBg}`]: {
      backgroundColor: 'rgba(0,0,0,0)',
    },
    [`&.${classes.spacingSmall}`]: {
      padding: spacing(2, 5),
      [breakpoints.only('xs')]: {
        padding: spacing(2, 2),
      },
    },

    [`& .${classes.content}`]: {
      gridColumn: '2 / span 1',
    },

    [`&.${classes.noLeftPadding}`]: {
      paddingLeft: 0
    },
    [`&.${classes.noRightPadding}`]: {
      paddingRight: 0
    },
    [`&.${classes.noTopPadding}`]: {
      paddingTop: 0
    },
    [`&.${classes.noBottomPadding}`]: {
      paddingBottom: 0
    },
  })
);

export const Section: React.FC<SectionProps> = ({
  type = 'normal',
  theme = 'white',
  topOverlay = false,
  relative = false,
  noPadding,
  children,
  spacingType = 'large',
}) => {
  return (
    <Root
      className={clsx(classes.root, {
        [classes.narrowStyle]: type === 'narrow',
        [classes.grayBg]: theme === 'gray',
        [classes.blueBg]: theme === 'blue',
        [classes.noneBg]: theme === 'none',
        [classes.darkBlueBg]: theme === 'darkBlue',
        [classes.relative]: relative === true,
        [classes.topOverlay]: topOverlay,
        [classes.spacingSmall]: spacingType === 'small',
        [classes.noLeftPadding]: noPadding === 'left' || noPadding === 'all' || noPadding === 'horizontal',
        [classes.noRightPadding]: noPadding === 'right' || noPadding === 'all' || noPadding === 'horizontal',
        [classes.noTopPadding]: noPadding === 'top' || noPadding === 'all' || noPadding === 'vertical',
        [classes.noBottomPadding]: noPadding === 'bottom' || noPadding === 'all' || noPadding === 'vertical',
      })}>
      <div className={classes.content}>{children}</div>
    </Root>
  );
};
