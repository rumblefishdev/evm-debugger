import { Stack } from '@mui/material'
import React from 'react'

import { Footer, Header } from '../../../importedComponents'
import type { IBlogPost } from '../../../importedComponents/contentful-ui.types'
import { RenderWithAlgeaTheme } from '../../../importedComponents/utils/RenderWithAlgeaTheme'
import { GAnalytics } from '../../../components/GAnalytics'

import { StyledStack } from './styles'

export const Layout: React.FC<React.PropsWithChildren<{ blogs: IBlogPost[] }>> = ({ children, blogs }) => (
  <StyledStack>
    <Header blogs={blogs} />
    <GAnalytics />
    <Stack
      sx={{
        minHeight: '700px',
        flexGrow: 1,
        alignItems: 'center',
      }}
    >
      {children}
    </Stack>
    <RenderWithAlgeaTheme>
      <Footer />
    </RenderWithAlgeaTheme>
  </StyledStack>
)
