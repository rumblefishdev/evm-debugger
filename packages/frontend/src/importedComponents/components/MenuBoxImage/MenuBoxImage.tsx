import React from 'react'

import { getCmsOptimizedUrl } from '../../utils/getCmsOptimizedUrl'
import { truncateText, removeDash } from '../../utils/stringUtilis'

import type { MenuBoxImageProps } from './MenuBoxImage.types'
import { StyledStack, StyledHeadline, StyledTextWrapper, StyledImage, StyledText } from './styles'

export const MenuBoxImage = ({ headline, text, img, link, ...props }: MenuBoxImageProps) => {
  const truncatedText = truncateText(text, 80)
  const adjustedHeadline = removeDash(headline)
  const adjustedImage = getCmsOptimizedUrl({
    width: 128,
    url: img,
    quality: 100,
  })
  return (
    <a
      href={link}
      style={{ textDecoration: 'none' }}
    >
      <StyledStack
        direction="row"
        spacing={2}
        {...props}
      >
        <StyledImage
          src={adjustedImage}
          alt="menu box"
        />
        <StyledTextWrapper>
          <StyledHeadline variant="buttonSmall">{adjustedHeadline}</StyledHeadline>
          <StyledText variant="caption">{truncatedText}</StyledText>
        </StyledTextWrapper>
      </StyledStack>
    </a>
  )
}
