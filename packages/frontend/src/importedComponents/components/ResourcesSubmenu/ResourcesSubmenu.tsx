import { useTheme, Stack, Typography } from '@mui/material'
import React from 'react'

import { MenuItem } from '../MenuItem'
import Ebook1Img from '../../assets/png/ebook1.png'
import Ebook2Img from '../../assets/png/ebook2.png'
import Ebook3Img from '../../assets/png/ebook3.png'
import Ebook1ImgSmall from '../../assets/png/ebook1-small.png'
import Ebook2ImgSmall from '../../assets/png/ebook2-small.png'
import Ebook3ImgSmall from '../../assets/png/ebook3-small.png'
import { MenuBoxCover } from '../MenuBoxCover'
import { Section } from '../Section'

import type { ResourcesSubmenuProps } from './ResourcesSubmenu.types'
import {
  StyledDivider,
  StyledStack,
  StyledEbookSectionWrapper,
  StyledMenuItemIconLink,
  StyledBlogSectionWrapper,
  StyledSectionWrapper,
  StyledMenuBoxImage,
  StyledLinkWrapper,
} from './styles'

const Link: React.FC<{ to: string; noIcon?: boolean } & React.PropsWithChildren> = ({ to, children, noIcon }) => {
  const theme = useTheme()

  if (theme.utilis.isMobile())
    return (
      <StyledLinkWrapper>
        <MenuItem
          sx={{ fontSize: '1rem' }}
          noIcon={noIcon}
          to={to}
        >
          {children}
        </MenuItem>
      </StyledLinkWrapper>
    )

  return (
    <StyledMenuItemIconLink
      noIcon={noIcon}
      to={to}
    >
      {children}
    </StyledMenuItemIconLink>
  )
}

const EbooksSection = () => {
  const theme = useTheme()
  return (
    <>
      <Stack
        sx={{
          margin: theme.spacing(1, 0, 2, 0),
          [theme.breakpoints.down('md')]: { margin: theme.spacing(0) },
        }}
      >
        <Typography
          variant="buttonSmall"
          sx={{
            color: theme.palette.colorBrand?.primary,
            [theme.breakpoints.down('md')]: { fontSize: '1rem' },
          }}
        >
          Check all ebooks
        </Typography>
      </Stack>

      <StyledDivider
        sx={{
          [theme.breakpoints.up('md')]: {
            display: 'none',
          },
        }}
      />

      <StyledEbookSectionWrapper sx={{ img: { filter: 'none !important' } }}>
        <MenuBoxCover
          to="/resources/fintech-mvp-guide"
          cover={theme.utilis.isMobile() ? Ebook3ImgSmall : Ebook3Img}
          text={'The Ultimate Guide to \nBuilding Your Fintech MVP'}
        />
        <MenuBoxCover
          to="/resources/workshop"
          cover={theme.utilis.isMobile() ? Ebook2ImgSmall : Ebook2Img}
          text={'Discovery \nWorkshop'}
        />
        <MenuBoxCover
          to="/resources/blockchain"
          cover={theme.utilis.isMobile() ? Ebook1ImgSmall : Ebook1Img}
          text={'Blockchain \nTrends in 2022'}
        />
      </StyledEbookSectionWrapper>
    </>
  )
}

export const ResourcesSubmenu = ({ blogs, ...props }: ResourcesSubmenuProps) => {
  const theme = useTheme()
  const firstSixBlogs = blogs.slice(0, 6)

  const adjustedBlogsData = firstSixBlogs.map((blog) => {
    return {
      text: blog.fields.title,
      link: `/blog/post/${blog.fields.slug}`,
      img: blog.fields.image.fields.file.url,
      headline: blog.fields.category[0],
    }
  })

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
            <Link to="/blog">Visit our blog</Link>
          </Stack>

          <StyledDivider
            sx={{
              [theme.breakpoints.up('md')]: {
                display: 'none',
              },
            }}
          />

          <StyledBlogSectionWrapper>
            {adjustedBlogsData.map((item, index) => (
              <StyledMenuBoxImage
                sx={{ img: { filter: 'none !important' } }}
                key={index}
                {...item}
              />
            ))}
          </StyledBlogSectionWrapper>
        </StyledSectionWrapper>

        <StyledDivider
          sx={{
            [theme.breakpoints.down('md')]: {
              display: 'none',
            },
          }}
        />

        <StyledSectionWrapper sx={{ width: '100%' }}>
          <EbooksSection />
        </StyledSectionWrapper>
      </StyledStack>
    </Section>
  )
}
