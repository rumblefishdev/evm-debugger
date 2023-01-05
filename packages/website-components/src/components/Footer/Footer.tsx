import { Hidden, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'

import FacebookIcon from '../../assets/svg/facebook-white.svg'
import LinkedinIcon from '../../assets/svg/linkedin-white.svg'
import TwitterIcon from '../../assets/svg/twitter-white.svg'
import { RenderWithAlgeaTheme } from '../../utils/RenderWithAlgeaTheme'
import { Link } from '../Link'
import { Section } from '../Section'

import type { FooterProps } from './Footer.types'
import {
  StyledStack,
  StyledHeading,
  StyledItem,
  StyledImg,
  LeftSideWrapper,
  RightSideWrapper,
  LeftContentWrapper,
  ContactWrapper,
  ContactDetailsWrapper,
  StyledClutchBox,
} from './styles'

const Menu = () => {
  return (
    <LeftContentWrapper>
      <StyledHeading variant="overline">Menu</StyledHeading>
      <Link to="/">
        <StyledItem variant="caption">Home</StyledItem>
      </Link>
      <Link to="/services">
        <StyledItem variant="caption">Services</StyledItem>
      </Link>
      <Link to="/case-studies">
        <StyledItem variant="caption">Case Studies</StyledItem>
      </Link>
      <Link to="/blog">
        <StyledItem variant="caption">Blog</StyledItem>
      </Link>
      <Link to="/team">
        <StyledItem variant="caption">Team</StyledItem>
      </Link>
      <Link to="/careers">
        <StyledItem variant="caption">Careers</StyledItem>
      </Link>
      <Link to="/contact">
        <StyledItem variant="caption">Contact</StyledItem>
      </Link>
    </LeftContentWrapper>
  )
}

// const ClutchReviews: React.FC = () => {
//   return (
//     <StyledClutchBox>
//       <Script src="https://widget.clutch.co/static/js/widget.js" />
//       <div
//         className="clutch-widget"
//         data-url="https://widget.clutch.co"
//         data-widget-type="2"
//         data-height="45"
//         data-nofollow="true"
//         data-expandifr="true"
//         data-theme="white"
//         data-scale="100"
//         data-clutchcompany-id="577137"
//       />
//     </StyledClutchBox>
//   )
// }

const Services: React.FC<{ boxWidth?: string }> = ({ boxWidth }) => {
  return (
    <LeftContentWrapper sx={{ width: boxWidth }}>
      <StyledHeading variant="overline">Services</StyledHeading>
      <Link to="/services/custom-project-development/">
        <StyledItem variant="caption">Custom Project Development</StyledItem>
      </Link>
      <Link to="/services/audit-and-consulting">
        <StyledItem variant="caption">Audit and Consulting</StyledItem>
      </Link>
      <Link to="/resources/workshop">
        <StyledItem variant="caption">Workshops</StyledItem>
      </Link>
      <Link to="/services/dedicated-teams-and-specialists/">
        <StyledItem variant="caption">Dedicated Teams and Specialists</StyledItem>
      </Link>
    </LeftContentWrapper>
  )
}

const Contact = () => {
  return (
    <ContactWrapper>
      <StyledHeading variant="overline">RUMBLE FISH POLAND SP Z O. O.</StyledHeading>
      <ContactDetailsWrapper>
        <Typography variant="caption" sx={{ whiteSpace: 'pre-line', marginBottom: '24px' }}>
          {'Filipa Eisenberga 11/3 \n31-523 Kraków, Poland \nPL6772425725'}
        </Typography>
        <Stack>
          <Typography variant="caption">P: +48 737 455 594</Typography>
          <Typography variant="caption">E: hello@rumblefish.dev</Typography>
          <Hidden smDown>{/* <ClutchReviews /> */}</Hidden>
        </Stack>
      </ContactDetailsWrapper>
      <Hidden smUp>{/* <ClutchReviews /> */}</Hidden>
    </ContactWrapper>
  )
}

const SocialMedia = () => {
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Typography sx={{ width: '68px', opacity: 0.5, marginTop: '-2px' }} variant="overline">
          Follow us
        </Typography>
        <Link to="https://www.facebook.com/rumblefishsoftwaredevelopment">
          <StyledImg src={FacebookIcon} alt="facebook" />
        </Link>
        <Link to="https://www.linkedin.com/company/rumblefishdev/">
          <StyledImg src={LinkedinIcon} alt="linkedin" />
        </Link>
        <Link to="https://twitter.com/rumblefishdev">
          <StyledImg src={TwitterIcon} alt="twitter" />
        </Link>
      </Stack>
      <StyledItem variant="caption">Copyright © {new Date().getFullYear()} Rumblefish</StyledItem>
    </>
  )
}

export const Footer = ({ ...props }: FooterProps) => {
  const theme = useTheme()

  return (
    <RenderWithAlgeaTheme>
      <Section width="small" positionRelativeOn backgroundColor={theme.palette.colorBrand?.primary}>
        <StyledStack {...props}>
          <LeftSideWrapper>
            <Contact />
            <Hidden smDown>
              <Menu />
              <Services />
            </Hidden>
            <Hidden smUp>
              <Stack flexDirection="row" justifyContent="space-between" width="100%">
                <Menu />
                <Services boxWidth="135px" />
              </Stack>
            </Hidden>
          </LeftSideWrapper>
          <RightSideWrapper>
            <SocialMedia />
          </RightSideWrapper>
        </StyledStack>
      </Section>
    </RenderWithAlgeaTheme>
  )
}
