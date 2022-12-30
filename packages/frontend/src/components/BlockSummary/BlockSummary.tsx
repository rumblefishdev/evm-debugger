import React from 'react'

import { useTypedSelector } from '../../store/storeHooks'
import { selectParsedActiveBlock } from '../../store/activeBlock/activeBlock.selector'

import type { BlockSummaryProps, CallBlockSummaryProps, CreateBlockSummaryProps, DefaultBlockSummaryProps } from './BlockSummary.types'
import { StyledBox, StyledInfoRow, StyledInfoType, StyledInfoValue, StyledSectionHeader, StyledWrapper, StyleRawBytecode } from './styles'
import { ParamBlock } from './DataBlocks/ParamBlock'
import { StorageBlock } from './DataBlocks/StorageBlock'
import { EventBlock } from './DataBlocks/EventBlock'

const CallBlockSummary = ({ data }: CallBlockSummaryProps) => {
  const {
    errorSignature,
    functionSignature,
    isContract,
    parsedError,
    parsedEvents,
    parsedOutput,
    parsedInput,
    storageAddress,
    storageLogs,
    input,
    output,
  } = data

  if (!isContract) return null

  return (
    <>
      <StyledInfoRow>
        <StyledInfoType>Is contract</StyledInfoType>
        <StyledInfoValue>{isContract ? 'true' : 'false'}</StyledInfoValue>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Raw input</StyledInfoType>
        <StyleRawBytecode>{input}</StyleRawBytecode>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Raw output</StyledInfoType>
        <StyleRawBytecode>{output}</StyleRawBytecode>
      </StyledInfoRow>
      {functionSignature ? (
        <StyledSectionHeader>
          Decoded Function: <b>{functionSignature}</b>
        </StyledSectionHeader>
      ) : null}
      {parsedInput ? <ParamBlock title="Inputs" items={parsedInput} /> : null}
      {parsedOutput ? <ParamBlock title="Outputs" items={parsedOutput} /> : null}
      {errorSignature ? (
        <StyledSectionHeader>
          Decoded Error: <b>{errorSignature}</b>
        </StyledSectionHeader>
      ) : null}
      {parsedError ? <ParamBlock title="Error" items={parsedError} /> : null}
      <StyledSectionHeader>Events:</StyledSectionHeader>
      <EventBlock eventLogs={parsedEvents} />
      <StorageBlock storageAddress={storageAddress} storageLogs={storageLogs} />
    </>
  )
}

const CreateBlockSummary = ({ data }: CreateBlockSummaryProps) => {
  const { input, salt, storageAddress, storageLogs } = data
  return (
    <>
      <StyledInfoRow>
        <StyledInfoType>Salt</StyledInfoType>
        <StyledInfoValue>{salt}</StyledInfoValue>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Raw input</StyledInfoType>
        <StyleRawBytecode>{input}</StyleRawBytecode>
      </StyledInfoRow>
      <StorageBlock storageAddress={storageAddress} storageLogs={storageLogs} />
    </>
  )
}

const DefaultBlockSummary = ({ data }: DefaultBlockSummaryProps) => {
  const { address, blockNumber, gasCost, passedGas, stackTrace, type, value, isSuccess } = data

  return (
    <>
      <StyledInfoRow>
        <StyledInfoType>Address</StyledInfoType>
        <StyledInfoValue>{address}</StyledInfoValue>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Is Success</StyledInfoType>
        <StyledInfoValue>{isSuccess ? 'true' : 'false'}</StyledInfoValue>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Type</StyledInfoType>
        <StyledInfoValue>{type}</StyledInfoValue>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Stack trace</StyledInfoType>
        <StyledInfoValue>{stackTrace}</StyledInfoValue>
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
    </>
  )
}

export const BlockSummary: React.FC<BlockSummaryProps> = () => {
  const currentBlock = useTypedSelector(selectParsedActiveBlock)

  const { callSpecificData, createSpecificData, defaultData } = currentBlock

  return (
    <StyledBox>
      <StyledWrapper>
        {defaultData ? <DefaultBlockSummary data={defaultData} /> : null}
        {callSpecificData ? <CallBlockSummary data={callSpecificData} /> : null}
        {createSpecificData ? <CreateBlockSummary data={createSpecificData} /> : null}
      </StyledWrapper>
    </StyledBox>
  )
}
