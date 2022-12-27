import React from 'react'

import { parseStackTrace } from '../../helpers/helpers'

import type { TreemapTooltipProps } from './TreemapTooltip.types'
import {
  StyledTooltip,
  StyledInfoRow,
  StyledInfoType,
  StyledInfoValue,
  StyledWrapper,
} from './styles'

export const TreemapTooltip = ({
  gasCost,
  stackTrace,
  type,
  ...props
}: TreemapTooltipProps) => (
  <StyledTooltip
    title={
      <StyledWrapper>
        <StyledInfoRow>
          <StyledInfoType>Type</StyledInfoType>
          <StyledInfoValue>{type}</StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoType>Gas Cost</StyledInfoType>
          <StyledInfoValue>{gasCost}</StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoType>Stack Trace</StyledInfoType>
          <StyledInfoValue>{parseStackTrace(stackTrace)}</StyledInfoValue>
        </StyledInfoRow>
      </StyledWrapper>
    }
    followCursor={true}
    TransitionProps={{ timeout: 0 }}
    {...props}
  ></StyledTooltip>
)
