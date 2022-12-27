import { Stack, Typography } from '@mui/material'
import React from 'react'
import { ethers } from 'ethers'
import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'

import { useTypedSelector } from '../../store/storeHooks'
import { selectActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import { parseStackTrace } from '../../helpers/helpers'

import type {
  BlockSummaryProps,
  CallBlockSummaryProps,
  CreateBlockSummaryProps,
} from './BlockSummary.types'
import {
  StyledBox,
  StyledInfoRow,
  StyledInfoType,
  StyledInfoValue,
  StyledWrapper,
} from './styles'

const CallBlockSummary = ({ item, ...props }: CallBlockSummaryProps) => {
  const {
    events,
    input,
    output,
    decodedInput,
    decodedOutput,
    errorDescription,
    functionDescription,
    isContract,
    storageAddress,
    storageLogs,
  } = item

  console.log('input', input)
  console.log('decodedInput', decodedInput)
  console.log('functionDescription', functionDescription)

  console.log('output', decodedOutput)

  return (
    <>
      <StyledInfoRow>
        <StyledInfoType>Is contract</StyledInfoType>
        <StyledInfoValue>{isContract ? 'true' : 'false'}</StyledInfoValue>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Raw input</StyledInfoType>
        <StyledInfoValue>{input}</StyledInfoValue>
      </StyledInfoRow>
    </>
  )
}

const CreateBlockSummary = ({ item, ...props }: CreateBlockSummaryProps) => {
  const {
    address,
    gasCost,
    input,
    passedGas,
    stackTrace,
    type,
    isSuccess,
    value,
    blockNumber,
    salt,
    storageLogs,
    storageAddress,
  } = item
  return (
    <>
      <StyledInfoRow></StyledInfoRow>
    </>
  )
}

export const BlockSummary = ({ ...props }: BlockSummaryProps) => {
  const currentBlock = useTypedSelector(selectActiveBlock)

  if (!currentBlock) return <StyledBox></StyledBox>
  const renderBlock = () => {
    if (checkIfOfCallType(currentBlock))
      return <CallBlockSummary item={currentBlock} {...props} />
    if (checkIfOfCreateType(currentBlock))
      return <CreateBlockSummary item={currentBlock} {...props} />
  }

  const {
    address,
    gasCost,
    passedGas,
    stackTrace,
    type,
    value,
    blockNumber,
    storageAddress,
    storageLogs,
  } = currentBlock

  return (
    <StyledBox>
      <StyledWrapper>
        <StyledInfoRow>
          <StyledInfoType>Address</StyledInfoType>
          <StyledInfoValue>{address}</StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoType>Type</StyledInfoType>
          <StyledInfoValue>{type}</StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoType>Stack trace</StyledInfoType>
          <StyledInfoValue>{parseStackTrace(stackTrace)}</StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoType>Block Number</StyledInfoType>
          <StyledInfoValue>{blockNumber}</StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoType>Passed Gas</StyledInfoType>
          <StyledInfoValue>{passedGas}</StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoType>Gas Cost</StyledInfoType>
          <StyledInfoValue>{gasCost}</StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoType>Value</StyledInfoType>
          <StyledInfoValue>{value}</StyledInfoValue>
        </StyledInfoRow>
        {renderBlock()}
      </StyledWrapper>
    </StyledBox>
  )
}
