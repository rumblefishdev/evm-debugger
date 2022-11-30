import { Stack, Typography } from '@mui/material'
import React from 'react'

import { useTypedSelector } from '../../store/storeHooks'

import type { BlockSummaryProps } from './BlockSummary.types'
import { StyledBox } from './styles'

export const BlockSummary = ({ ...props }: BlockSummaryProps) => {
  const currentBlock = useTypedSelector((state) => state.activeBlock)

  return (
    <StyledBox {...props}>
      {currentBlock.stackTrace ? (
        <Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Typography>Type:</Typography>
            <Typography>{currentBlock.type}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Typography>Stack Trace:</Typography>
            <Typography>{currentBlock.stackTrace}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Typography>Gas Cost:</Typography>
            <Typography>{currentBlock.gasCost}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Typography>Passed Gas:</Typography>
            <Typography>{currentBlock.passedGas}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Typography>Input:</Typography>
            <Typography>{currentBlock.input}</Typography>
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Typography>Block Number:</Typography>
            <Typography>{currentBlock.blockNumber}</Typography>
          </Stack>
        </Stack>
      ) : null}
    </StyledBox>
  )
}
