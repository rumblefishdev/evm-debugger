import { Box } from '@mui/material'
import clsx from 'clsx'
import React from 'react'

import { sectionClasses } from './Section.types'
import type { SectionProps } from './Section.types'
import { StyledRoot } from './styles'

export const Section = ({
  width = 'full',
  children,
  backgroundColor = '#FFF',
  mobilePadding = true,
  positionRelativeOn,
  ...props
}: SectionProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        position: positionRelativeOn ? 'relative' : 'static',
        overflowX: 'clip',
        background: backgroundColor,
      }}
    >
      <StyledRoot
        {...props}
        maxWidth={false}
        disableGutters
        className={clsx(sectionClasses[width], {
          [sectionClasses.mobilePadding]: mobilePadding,
        })}
      >
        {children}
      </StyledRoot>
    </Box>
  )
}
