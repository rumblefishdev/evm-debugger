import { Box, useTheme } from '@mui/material'
import clsx from 'clsx'
import React from 'react'

import { isDarkOrNavy } from '../../utils/darkOrNavy'

import { sectionClasses } from './Section.types'
import type { SectionProps } from './Section.types'
import { StyledRoot } from './styles'

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
  const theme = useTheme()
  const isDarkOrNavyMode = isDarkOrNavy(theme)

  return (
    <Box
      ref={heightRef}
      sx={{
        width: '100%',
        position: positionRelativeOn ? 'relative' : 'static',
        overflowX: 'clip',
        height: useFullHeight ? '100%' : 'auto',
        background: isDarkOrNavyMode ? 'transparent' : backgroundColor,
      }}
    >
      <StyledRoot
        className={clsx(sectionClasses[width], {
          [sectionClasses.mobilePadding]: mobilePadding,
        })}
        {...props}
        maxWidth={false}
        disableGutters
      >
        {children}
      </StyledRoot>
    </Box>
  )
}
