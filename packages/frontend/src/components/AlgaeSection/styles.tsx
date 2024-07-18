import { Container, styled } from '@mui/material'

import { sectionClasses } from './Section.types'

export const StyledRoot = styled(Container)(({ theme }) => ({
  [`&.${sectionClasses.full}`]: {
    width: '100%',
    maxWidth: '100%',
  },
  [`&.${sectionClasses.normal}`]: {
    maxWidth: '1280px',
    [theme.breakpoints.up('md')]: {
      width: '95%',
    },
  },
  [`&.${sectionClasses.small}`]: {
    maxWidth: '1230px',
    [theme.breakpoints.up('md')]: {
      width: '95%',
    },
  },

  [`&.${sectionClasses.mobilePadding}`]: {
    ...theme.mixins.mobilePadding(),
  },
}))
