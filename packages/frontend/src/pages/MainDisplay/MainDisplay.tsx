import React from 'react'

import { BlockSummary } from '../../components/BlockSummary'
import { ContentMap } from '../../components/ContentMap'

import type { MainDisplayProps } from './MainDisplay.types'
import { StyledContentWrapper, StyledMainDisplay } from './styles'

export const MainDisplay = ({ ...props }: MainDisplayProps) => {
    return (
        <StyledMainDisplay {...props}>
            <StyledContentWrapper>
                <ContentMap />
                <BlockSummary />
            </StyledContentWrapper>
        </StyledMainDisplay>
    )
}
