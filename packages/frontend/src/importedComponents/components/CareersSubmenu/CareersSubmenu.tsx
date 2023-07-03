import { useTheme } from '@mui/material'

import { Section } from '../Section'

import type { CareersSubmenuProps } from './CareersSubmenu.types'
import { data } from './data.mock'
import { StyledStack, StyledDivider, StyledMenuBoxBigIcon, StyledWrapper, StyledText } from './styles'

export const CareersSubmenu = ({ ...props }: CareersSubmenuProps) => {
  const theme = useTheme()

  return (
    <Section
      width={theme.utilis.isMobile() ? 'full' : 'small'}
      backgroundColor="unset"
    >
      <StyledStack {...props}>
        <StyledText variant="buttonSmall">Careers</StyledText>
        <StyledDivider />
        <StyledWrapper>
          {data.map((item, index) => (
            <StyledMenuBoxBigIcon
              key={index}
              {...item}
            />
          ))}
        </StyledWrapper>
      </StyledStack>
    </Section>
  )
}
