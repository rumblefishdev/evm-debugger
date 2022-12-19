import { Typography } from '@mui/material'
import React from 'react'

import type { StructLogItemProps } from './StructLogItem.types'
import { StyledStack } from './styles'

export const StructLogItem = ({ counter, type, ...props }: StructLogItemProps) => (
  <StyledStack {...props}>
    <Typography>{counter}</Typography>
    <Typography>{type}</Typography>
  </StyledStack>
)
