import { type StackProps } from '@mui/material'
import React from 'react'
import type { LegacyRef } from 'react'

import { Section } from '../../../components/AlgaeSection'
import { Link } from '../../../components/AlgaeLink'
import discordIcon from '../../../assets/svg/discord.svg'

import {
  StyledStack,
  StyledBlocksStack,
  StyledHeading,
  StyledDescription,
  Block,
  StyledBlocksText,
  CenterEllipse,
  Line,
  StyledButton,
  DiscordIcon,
  ButtonWrapper,
  StyledTypography,
} from './styles'

export const OnlyDebuggerYouNeedSection = React.forwardRef(function Ref({ ...props }: StackProps, ref: LegacyRef<HTMLDivElement>) {
  const blocks = [
    'Your transaction failed and you want to learn why,',
    'Inspect the execution of a smart contract with a magnifying glass,',
    'Optimize gas usage of your transactions by looking at the graphical representation of gas usage of its constituents,',
    'Write Ethereum smart contracts in a more effective way,',
    'Gather as much transaction info as possible,',
    'Check out your smart contract before deployment.',
  ]
  return (
    <Section
      width="small"
      backgroundColor="transparent"
      positionRelativeOn
    >
      <div
        ref={ref}
        style={{ top: '-90px', position: 'relative' }}
      />
      <StyledStack {...props}>
        <CenterEllipse />
        <StyledHeading>
          The only EVM Debugger <br />
          you’ll need
        </StyledHeading>
        <StyledDescription>With our EVM Debugger you’ll get:</StyledDescription>
        <StyledBlocksStack>
          {blocks.map((blockName, index) => (
            <Block key={index}>
              <StyledBlocksText>{blockName}</StyledBlocksText>
            </Block>
          ))}
        </StyledBlocksStack>
        <ButtonWrapper>
          <Link
            to="https://discord.gg/GWqQ5DWgnd"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledButton fontColor="white">
              <DiscordIcon src={discordIcon} />
              <StyledTypography
                fontWeight={700}
                display={{ sm: 'none' }}
              >
                Join community on Discord
              </StyledTypography>
              <StyledTypography
                fontWeight={700}
                display={{ xs: 'none', sm: 'block' }}
              >
                Join EVM Debugger community on Discord
              </StyledTypography>
            </StyledButton>
          </Link>
        </ButtonWrapper>
        <Line></Line>
      </StyledStack>
    </Section>
  )
})
