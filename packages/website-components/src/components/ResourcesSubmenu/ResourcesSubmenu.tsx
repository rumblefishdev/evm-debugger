import { Hidden } from '@mui/material'
import React from 'react'

import Ebook1Img from '../../assets/png/ebook1.png'
import Ebook2Img from '../../assets/png/ebook2.png'
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
  StyledMarginTypography,
} from './styles'

const Link: React.FC<{ to: string; noIcon?: boolean } & React.PropsWithChildren> = ({ to, children, noIcon }) => {
  return (
    <StyledMenuItemIconLink noIcon={noIcon} to={to}>
      {children}
    </StyledMenuItemIconLink>
  )
}

const EbooksSection = () => {
  return (
    <>
      <StyledMarginTypography variant="bodySmall">Check out our ebooks</StyledMarginTypography>
      <Hidden lgUp>
        <StyledDivider />
      </Hidden>
      <StyledEbookSectionWrapper>
        <MenuBoxCover to="/resources/workshop" cover={Ebook2Img} text={'Discovery \nWorkshop'} />
        <MenuBoxCover to="/resources/blockchain" cover={Ebook1Img} text={'Blockchain \nTrends in 2022'} />
      </StyledEbookSectionWrapper>
    </>
  )
}

export const ResourcesSubmenu = ({ blogs, ...props }: ResourcesSubmenuProps) => {
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
    <Section backgroundColor="unset" width="small">
      <StyledStack direction="row" alignItems="flex-start" justifyContent="space-between" {...props}>
        <StyledSectionWrapper sx={{ width: 'auto' }}>
          <Link to="/blog">Visit our blog</Link>
          <Hidden lgUp>
            <StyledDivider />
          </Hidden>
          <StyledBlogSectionWrapper>
            {adjustedBlogsData.map((item, index) => (
              <StyledMenuBoxImage key={index} {...item} />
            ))}
          </StyledBlogSectionWrapper>
        </StyledSectionWrapper>
        <Hidden lgDown>
          <StyledDivider />
        </Hidden>
        <StyledSectionWrapper sx={{ width: '100%' }}>
          <EbooksSection />
        </StyledSectionWrapper>
      </StyledStack>
    </Section>
  )
}
