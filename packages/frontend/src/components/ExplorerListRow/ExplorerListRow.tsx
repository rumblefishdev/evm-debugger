import { Box, Stack, Tooltip } from '@mui/material'
import { ethers } from 'ethers'
import React, { useEffect, useMemo, useRef } from 'react'

import { opcodesDictionary } from '../../helpers/opcodesDictionary'
import { QuestionFilledBlue, QuestionOutlinedBlue } from '../../icons'

import type { ExplorerListRowProps } from './ExplorerListRow.types'
import { StyledChip, StyledChipText, StyledCounter, StyledStack, StyledType, StyledTypeWrapper } from './styles'

export const ExplorerListRow = ({ chipValue, pc, opCode, isActive, onClick, ...props }: ExplorerListRowProps) => {
  const itemRef = useRef<HTMLDivElement>(null)

  const description = useMemo(() => {
    return opcodesDictionary[opCode].description ?? 'No description'
  }, [opCode])

  const counter = useMemo(() => {
    return typeof pc === 'number' ? ethers.utils.hexlify(pc) : ethers.utils.hexlify(ethers.BigNumber.from(pc))
  }, [pc])

  useEffect(() => {
    if (isActive && itemRef.current) itemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [isActive, itemRef])

  return (
    <StyledStack active={isActive} {...props} ref={itemRef} onClick={onClick}>
      <StyledTypeWrapper>
        <StyledCounter active={isActive}>{counter}</StyledCounter>
        <Tooltip title={description}>
          <Stack flexDirection="row">
            <StyledType active={isActive}>{opCode}</StyledType>
            {isActive ? <QuestionOutlinedBlue /> : <QuestionFilledBlue />}
          </Stack>
        </Tooltip>
      </StyledTypeWrapper>
      {chipValue ? (
        <Tooltip title={chipValue}>
          <StyledChip active={isActive}>
            <StyledChipText active={isActive}>{chipValue}</StyledChipText>
          </StyledChip>
        </Tooltip>
      ) : null}
    </StyledStack>
  )
}
