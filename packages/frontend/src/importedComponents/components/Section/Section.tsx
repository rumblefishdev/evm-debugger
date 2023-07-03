import { Box, useTheme } from '@mui/material'
import clsx from 'clsx'
import React from 'react'

import { isDarkOrNavy } from '../../../helpers/helpers'

import { sectionClasses } from './Section.types'
import type { SectionProps } from './Section.types'
import { StyledRoot } from './styles'

export const Section = ({
  width = 'full',
  height = 'autoHeight',
  children,
  backgroundColor = '#FFF',
  mobilePadding = true,
  positionRelativeOn,
  heightRef = null,
  backDropFilter = false,
  ...props
}: SectionProps) => {
  const useIsDarkOrNavyMode = (): boolean => {
    const theme = useTheme()
    return isDarkOrNavy(theme)
  }
  return (
    <Box
      ref={heightRef}
      sx={{
        width: '100%',
        position: positionRelativeOn ? 'relative' : 'static',
        overflowX: 'clip',
        height: height === 'fullHeight' ? '100%' : 'auto',
        background: useIsDarkOrNavyMode ? 'transparent' : backgroundColor,
        backdropFilter: backDropFilter ? 'blur(16px)' : '',
      }}
    >
      <StyledRoot
        {...props}
        maxWidth={false}
        disableGutters
        className={clsx(sectionClasses[width], sectionClasses[height], {
          [sectionClasses.mobilePadding]: mobilePadding,
        })}
      >
        {children}
      </StyledRoot>
    </Box>
  )
}
