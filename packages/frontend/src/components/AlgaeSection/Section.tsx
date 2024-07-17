import { Box, useTheme } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { isDarkOrNavy } from '../../utils/darkOrNavy';
import { sectionClasses } from './Section.types';
import type { SectionProps } from './Section.types';
import { StyledRoot } from './styles';
export const Section = ({
  width = 'full',
  children,
  useFullHeight = false,
  backgroundColor = '#FFF',
  mobilePadding = true,
  positionRelativeOn,
  heightRef = null,
  ...props
}: SectionProps) => {
  const theme = useTheme();
  const useIsDarkOrNavyMode = isDarkOrNavy(theme);

  return (
    <Box
      ref={heightRef}
      sx={{
        background: useIsDarkOrNavyMode ? 'transparent' : backgroundColor,
        width: '100%',
        overflowX: 'clip',
        position: positionRelativeOn ? 'relative' : 'static',
        height: useFullHeight ? '100%' : 'auto',
      }}>
      <StyledRoot
        className={clsx(sectionClasses[width], {
          [sectionClasses.mobilePadding]: mobilePadding,
        })}
        {...props}
        maxWidth={false}
        disableGutters>
        {children}
      </StyledRoot>
    </Box>
  );
};
