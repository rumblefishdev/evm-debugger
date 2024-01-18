import { Box, Stack, Tooltip } from '@mui/material'
import { toBeHex } from 'ethers'
import { useMemo, useRef } from 'react'

import { opcodesDictionary } from '../../helpers/opcodesDictionary'
import { GasBlack, GasWhite, QuestionFilledBlue, QuestionOutlinedBlue } from '../../icons'

import type { ExplorerListRowProps } from './ExplorerListRow.types'
import { StyledChip, StyledChipText, StyledCounter, StyledStack, StyledType, StyledTypeWrapper } from './styles'

export const ExplorerListRow = ({ chipValue, pc, opCode, isActive, onClick, displayGasIcon = false, ...props }: ExplorerListRowProps) => {
  const itemRef = useRef<HTMLDivElement>(null)

  const description = useMemo(() => {
    return opcodesDictionary[opCode]?.description ?? 'No description'
  }, [opCode])

  const counter = useMemo(() => {
    return typeof pc === 'number' ? toBeHex(pc) : toBeHex(BigInt(pc))
  }, [pc])

  return (
    <StyledStack
      active={isActive}
      {...props}
      ref={itemRef}
      onClick={onClick}
    >
      <StyledTypeWrapper>
        <Box
          display="flex"
          alignItems="center"
          flex="2"
          flexWrap="wrap"
        >
          <StyledCounter active={isActive}>{counter}</StyledCounter>
          <Box
            display="flex"
            alignItems="center"
          >
            <StyledType active={isActive}>{opCode}</StyledType>
            <Tooltip title={description}>
              <Stack flexDirection="row">{isActive ? <QuestionOutlinedBlue /> : <QuestionFilledBlue />}</Stack>
            </Tooltip>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
        >
          {chipValue ? (
            <Box ml={1}>
              <Tooltip title={typeof chipValue === 'number' ? `This step cost ${chipValue} units of gas ` : chipValue}>
                <StyledChip active={isActive}>
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    {displayGasIcon && <Box mr={0.5}>{isActive ? <GasWhite /> : <GasBlack />}</Box>}
                    <StyledChipText active={isActive}>{chipValue}</StyledChipText>
                  </Box>
                </StyledChip>
              </Tooltip>
            </Box>
          ) : null}
        </Box>
      </StyledTypeWrapper>
    </StyledStack>
  )
}
