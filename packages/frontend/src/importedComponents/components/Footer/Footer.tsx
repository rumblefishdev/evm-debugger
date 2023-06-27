import { Hidden, Stack, Typography, useTheme } from '@mui/material'
// import Script from 'next/dist/client/script'
import React from 'react'
import { Helmet } from 'react-helmet'

import { isDarkOrNavy } from '../../../helpers/helpers'
import FacebookIcon from '../../assets/svg/facebook-white.svg'
import LinkedinIcon from '../../assets/svg/linkedin-white.svg'
import TwitterIcon from '../../assets/svg/twitter-white.svg'
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

const ClutchReviews: React.FC = () => {
  return (
    <StyledClutchBox>
      <Helmet>
        <meta charSet="utf-8" />
        <title>EVM Debugger by Rumble Fish - the ultimate tool for EVM smart contract analysis</title>
        <link
          rel="canonical"
          href="https://widget.clutch.co/static/js/widget.js"
        />
      </Helmet>

      <div
        className="clutch-widget"
        data-url="https://widget.clutch.co"
        data-widget-type="2"
        data-height="45"
        data-nofollow="true"
        data-expandifr="true"
        data-theme="white"
        data-scale="100"
        data-clutchcompany-id="577137"
      />
    </StyledClutchBox>
  )
}

const Services: React.FC<{ boxWidth?: string }> = ({ boxWidth }) => {
  return (
    <LeftContentWrapper sx={{ width: boxWidth }}>
      <StyledHeading variant="overline">Services</StyledHeading>
      <Link to="/services/aws-cloud-solutions/">
        <StyledItem variant="caption">AWS Cloud Solutions </StyledItem>
      </Link>
      <Link to="/services/defi-development/">
        <StyledItem variant="caption">DEFI Development</StyledItem>
      </Link>
      <Link to="/services/blockchain-software-development/">
        <StyledItem variant="caption">Blockchain Development</StyledItem>
      </Link>
      <Link to="/startup/">
        <StyledItem variant="caption">IT Services for Startups</StyledItem>
      </Link>
      <Link to="/services/web-development/">
        <StyledItem variant="caption">Web Development</StyledItem>
      </Link>
      <Link to="/services/nft-development/">
        <StyledItem variant="caption">NFT Development</StyledItem>
      </Link>
      <Link to="/services/dedicated-development-teams/">
        <StyledItem variant="caption">Dedicated Development Teams</StyledItem>
      </Link>
      <Link to="/services/mobile-development/">
        <StyledItem variant="caption">Mobile Development</StyledItem>
      </Link>
      <Link to="/services/fintech-software-development/">
        <StyledItem variant="caption">Fintech Software Development</StyledItem>
      </Link>
      <Link to="/services/product-design/">
        <StyledItem variant="caption">UI/UX</StyledItem>
      </Link>
    </LeftContentWrapper>
  )
}

const Contact = () => {
  const useIsDarkOrNavyMode = (): boolean => {
    const theme = useTheme()
    return isDarkOrNavy(theme)
  }
  return (
    <ContactWrapper>
      <StyledHeading variant="overline">Rumblefish sp z o.o.</StyledHeading>
      <ContactDetailsWrapper
        sx={{
          span: {
            fontFamily: useIsDarkOrNavyMode ? 'Inter' : 'default',
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            whiteSpace: 'pre-line',
            marginBottom: '24px',
          }}
        >
          {'Filipa Eisenberga 11/3 \n31-523 Kraków, Poland \nPL6772425725'}
        </Typography>
        <Stack>
          <Typography variant="caption">P: +48 737 455 594</Typography>
          <Typography variant="caption">E: hello@rumblefish.dev</Typography>
          <Hidden
            smDown
            implementation="css"
          >
            <ClutchReviews />
          </Hidden>
        </Stack>
      </ContactDetailsWrapper>
      <Hidden
        smUp
        implementation="css"
      >
        <ClutchReviews />
      </Hidden>
    </ContactWrapper>
  )
}

const SocialMedia = () => {
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
      >
        <Typography
          sx={{ width: '68px', opacity: 0.5, marginTop: '-2px' }}
          variant="overline"
        >
          Follow us
        </Typography>
        <Link to="https://www.facebook.com/rumblefishsoftwaredevelopment">
          <StyledImg
            src={FacebookIcon}
            alt="facebook"
          />
        </Link>
        <Link to="https://www.linkedin.com/company/rumblefishdev/">
          <StyledImg
            src={LinkedinIcon}
            alt="linkedin"
          />
        </Link>
        <Link to="https://twitter.com/rumblefishdev">
          <StyledImg
            src={TwitterIcon}
            alt="twitter"
          />
        </Link>
      </Stack>
      <StyledItem variant="caption">Copyright © 2023 Rumblefish</StyledItem>
    </>
  )
}

export const Footer = ({ ...props }: FooterProps) => {
  const theme = useTheme()
  const useIsDarkOrNavyMode = (): boolean => {
    return isDarkOrNavy(theme)
  }
  return (
    <Section
      width="small"
      positionRelativeOn
      backgroundColor={useIsDarkOrNavyMode ? 'transparent' : theme.palette.colorBrand?.primary}
    >
      <StyledStack {...props}>
        <LeftSideWrapper
          sx={{
            [theme.breakpoints.down('sm')]: {
              display: 'none',
            },
          }}
        >
          <Contact />
          <Menu />
          <Services />
        </LeftSideWrapper>
        <LeftSideWrapper
          sx={{
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
          }}
        >
          <Contact />
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
          >
            <Menu />
            <Services boxWidth="135px" />
          </Stack>
        </LeftSideWrapper>

        <RightSideWrapper>
          <SocialMedia />
        </RightSideWrapper>
      </StyledStack>
    </Section>
  )
}
