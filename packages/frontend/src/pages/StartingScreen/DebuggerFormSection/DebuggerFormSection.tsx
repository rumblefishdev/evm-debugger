import type { RefObject } from 'react'
import React, { useCallback, useState } from 'react'
import type { StackProps } from '@mui/material'
import downArrow from '../../../assets/svg/arrow-down-white.svg'
import { Section } from '../../../components/AlgaeSection'
import { generateArrowAnimation } from '../../../utils/arrowAnimationStyles'

import { Debugger } from '../../../components/Debugger'
import evmLogo from '../../../assets/svg/evm.svg'

import {
  StyledStack,
  StyledTextSpace,
  Chequered,
  StyledHeading,
  StyledDescription,
  ArrowScrollContainer,
  StyledDiversionStack,
  LeftEllipse,
  RightEllipse,
  WaveVector,
  Line,
  StyledIcon,
  ArrowCircle,
  StyledLogo,
} from './styles'

export const DebuggerFormSection = React.forwardRef(function Ref({ ...props }: StackProps, ref: RefObject<HTMLDivElement>) {
  const scrollToNextSection = useCallback(() => {
    console.log(props)
    ref?.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [props, ref])

  const [isHover, setisHover] = useState(false)
  const { arrowHiddenMouseOff, arrowHiddenMouseOn, arrowVisibleMouseOff, arrowVisibleMouseOn } = generateArrowAnimation('down', '100px')

  return (
    <Section
      width="small"
      backgroundColor="transparent"
    >
      <StyledStack {...props}>
        <Chequered />
        <LeftEllipse />
        <RightEllipse />
        <WaveVector />
        <StyledDiversionStack>
          <StyledTextSpace>
            <StyledLogo src={evmLogo} />
            <StyledHeading>
              Debugging EVM <br />
              smart contracts made easy!
            </StyledHeading>
            <StyledDescription>
              <span>EVM Debugge</span> is a unique, free tool for EVM & Defi developers. It enables really easy and user-friendly analysis
              of Ethereum smart contracts. With EVM Debugger blockchain developers can smoothly access all details regarding a single
              Ethereum transaction.
            </StyledDescription>
          </StyledTextSpace>

          {<Debugger />}
        </StyledDiversionStack>

        <ArrowScrollContainer
          onMouseEnter={() => setisHover(true)}
          onMouseLeave={() => setisHover(false)}
          onClick={() => scrollToNextSection()}
        >
          <Line />
          <ArrowCircle>
            <StyledIcon
              src={downArrow}
              sx={isHover ? arrowVisibleMouseOn : arrowVisibleMouseOff}
            />
            <StyledIcon
              src={downArrow}
              sx={isHover ? arrowHiddenMouseOn : arrowHiddenMouseOff}
            />
          </ArrowCircle>
          <Line />
        </ArrowScrollContainer>
      </StyledStack>
    </Section>
  )
})
