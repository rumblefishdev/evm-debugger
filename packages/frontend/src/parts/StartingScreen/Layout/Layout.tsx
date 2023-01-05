import { Stack } from '@mui/material'
import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { Footer, Header } from '@evm-debuger/website-compontents'

import type { LayoutProps } from './Layout.types'
import { StyledStack } from './styles'

export const Layout = ({ children, ...props }: LayoutProps) => {
  const blogsData = useLoaderData() as any[]

  console.log(blogsData)

  return (
    <StyledStack {...props}>
      <Header blogs={blogsData} />
      <Stack
        sx={{
          minHeight: '900px',
          justifyContent: 'center',
          flexGrow: 1,
          alignItems: 'center',
        }}
      >
        {children}
      </Stack>
      <Footer />
    </StyledStack>
  )
}
