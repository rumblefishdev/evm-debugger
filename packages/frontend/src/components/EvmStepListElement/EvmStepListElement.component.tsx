import { Box, Stack, Tooltip } from '@mui/material'
import { toBeHex } from 'ethers'
import { useMemo, useRef } from 'react'

import { opcodesDictionary } from '../../helpers/opcodesDictionary'
import { GasBlack, GasWhite, QuestionFilledBlue, QuestionOutlinedBlue } from '../../icons'

import type { EvmStepListElementProps } from './EvmStepListElement.types'
import {
  StyledChip,
  StyledChipText,
  StyledCounter,
  StyledGasTooltip,
  StyledLeftSideWrapper,
  StyledStack,
  StyledType,
  StyledWrapper,
} from './EvmStepListElement.styles'

const TooltipContent: React.FC<{ baseGasCost: number; dynamicGasCost: number }> = ({ baseGasCost, dynamicGasCost }) => (
  <Stack>
    <Box>Base gas cost: {baseGasCost}</Box>
    <Box>Dynamic gas cost: {dynamicGasCost}</Box>
  </Stack>
)

export const EvmStepListElement: React.FC<EvmStepListElementProps> = ({
  baseGasCost,
  pc,
  opCode,
  isActive,
  onClick,
  dynamicGasCost,
  pushValue,
  ...props
}) => {
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
      <StyledWrapper>
        <StyledLeftSideWrapper>
          <StyledCounter active={isActive}>{counter}</StyledCounter>
          <Stack
            flexDirection="row"
            alignItems="center"
          >
            <StyledType active={isActive}>{opCode}</StyledType>
            <Tooltip title={description}>
              <Stack flexDirection="row">{isActive ? <QuestionOutlinedBlue /> : <QuestionFilledBlue />}</Stack>
            </Tooltip>
          </Stack>
        </StyledLeftSideWrapper>
        <Stack
          flexDirection="row"
          alignItems="center"
        >
          {pushValue && (
            <Box ml={1}>
              <Tooltip title={pushValue}>
                <StyledChip active={isActive}>
                  <Stack alignItems="center">
                    <StyledChipText active={isActive}>Pushed: 0x{pushValue}</StyledChipText>
                  </Stack>
                </StyledChip>
              </Tooltip>
            </Box>
          )}

          <Box ml={1}>
            <StyledGasTooltip
              title={
                <TooltipContent
                  baseGasCost={baseGasCost}
                  dynamicGasCost={dynamicGasCost}
                />
              }
            >
              <StyledChip active={isActive}>
                <Box
                  display="flex"
                  alignItems="center"
                >
                  <Box mr={0.5}>{isActive ? <GasWhite /> : <GasBlack />}</Box>
                  <StyledChipText active={isActive}>{baseGasCost + Math.max(0, dynamicGasCost)}</StyledChipText>
                </Box>
              </StyledChip>
            </StyledGasTooltip>
          </Box>
        </Stack>
      </StyledWrapper>
    </StyledStack>
  )
}
