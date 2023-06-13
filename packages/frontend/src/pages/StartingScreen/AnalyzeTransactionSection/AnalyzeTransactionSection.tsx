import React from 'react'
import type { StackProps } from '@mui/material'

import { Section } from '../../../importedComponents/components/Section'

import { data } from './data'
import {
  StyledStack,
  StyledBlocksStack,
  StyledHeading,
  StyledDescription,
  Block,
  BlockIconStack,
  Chequered,
  IconCircleStack,
  StyledBlocksText,
  StyledIcon,
  Line,
  NetworksStyledStack,
  NetworksHeading,
  CurrentsNetworksStyledStack,
  NetworkName,
} from './styles'

export const AnalyzeTransactionSection: React.FC<StackProps> = ({ ...props }: StackProps) => {
  return (
    <Section
      width="small"
      backgroundColor="transparent"
      positionRelativeOn
    >
      <StyledStack {...props}>
        <Chequered />
        <StyledHeading>
          Analyze the Ethereum transaction <br />
          in one simple step
        </StyledHeading>
        <StyledDescription>With our EVM Debugger you’ll get:</StyledDescription>
        <StyledBlocksStack>
          {data.map((block, index) => (
            <Block key={index}>
              <BlockIconStack>
                <IconCircleStack>
                  <StyledIcon src={block.icon} />
                </IconCircleStack>
              </BlockIconStack>
              <StyledBlocksText>{block.text}</StyledBlocksText>
            </Block>
          ))}
        </StyledBlocksStack>
        <NetworksStyledStack>
          <NetworksHeading>Networks we currently support:</NetworksHeading>
          <CurrentsNetworksStyledStack>
            <NetworkName>Etherum</NetworkName>
            <NetworkName>Goerli</NetworkName>
            <NetworkName>Polygon</NetworkName>
            <NetworkName>Mumbai</NetworkName>
            <NetworkName>Sepolia</NetworkName>
          </CurrentsNetworksStyledStack>
          <NetworksHeading>
            And more on the way.
            <br />
            Stay tuned!
          </NetworksHeading>
        </NetworksStyledStack>
        <Line />
      </StyledStack>
    </Section>
  )
}
