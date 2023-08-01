import { useTheme, Stack } from '@mui/material'
import React from 'react'

import evmDebuggerScreen from '../../assets/png/evmDebuggerScreen.png'
import hadoukenScreen from '../../assets/png/hadoukenScreen.png'
import { Section } from '../Section'

import type { ResourcesSubmenuProps } from './ResourcesSubmenu.types'
import { StyledDivider, StyledStack, StyledBlogSectionWrapper, StyledSectionWrapper, StyledMenuBoxImage, StyledText } from './styles'

export const ProductsSubmenu = ({ ...props }: ResourcesSubmenuProps) => {
  const theme = useTheme()
  const productsData = [
    {
      text: 'ong established fact that a reader will be distracted by the readable content of a page when looking at its layout. T',
      link: `/evm-debugger`,
      img: evmDebuggerScreen,
      headline: 'EVM Debugger',
    },
    {
      text: 'ong established fact that a reader will be distracted by the readable content of a page when looking at its layout. T',
      link: `https://hadouken.finance/`,
      img: hadoukenScreen,
      headline: 'Hadouken',
    },
  ]

  return (
    <Section
      backgroundColor="unset"
      width={theme.utilis.isMobile() ? 'full' : 'small'}
    >
      <StyledStack
        gap={2}
        direction="column"
        alignItems="flex-start"
        justifyContent="space-between"
        {...props}
      >
        <StyledSectionWrapper sx={{ width: 'auto' }}>
          <Stack
            sx={{
              margin: theme.spacing(0, 0, 2, 0),
              [theme.breakpoints.down('md')]: {
                margin: theme.spacing(0),
              },
            }}
          >
            <StyledText variant="buttonSmall">Visit our products</StyledText>
          </Stack>

          <StyledDivider
            sx={{
              [theme.breakpoints.up('md')]: {
                display: 'none',
              },
            }}
          />

          <StyledBlogSectionWrapper>
            {productsData.map((item, index) => (
              <StyledMenuBoxImage
                sx={{ img: { filter: 'none !important' } }}
                key={index}
                {...item}
              />
            ))}
          </StyledBlogSectionWrapper>
        </StyledSectionWrapper>
      </StyledStack>
    </Section>
  )
}
