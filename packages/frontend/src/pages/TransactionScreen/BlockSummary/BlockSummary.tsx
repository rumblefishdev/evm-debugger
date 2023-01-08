import React from 'react'
import { Stack } from '@mui/system'

import { useTypedSelector } from '../../../store/storeHooks'
import { selectParsedActiveBlock } from '../../../store/activeBlock/activeBlock.selector'

import type { BlockSummaryProps, CallBlockSummaryProps, CreateBlockSummaryProps, DefaultBlockSummaryProps } from './BlockSummary.types'
import {
  StyledFunctionsignature,
  StyledInfoRow,
  StyledInfoType,
  StyledInfoValue,
  StyledSectionHeader,
  StyledStack,
  StyleRawBytecode,
} from './styles'
import { ParamBlock } from './DataBlocks/ParamBlock'
import { StorageBlock } from './DataBlocks/StorageBlock'
import { EventBlock } from './DataBlocks/EventBlock'
import { DataSection } from './DataSection'

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
    <DataSection title="Call specific data">
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
      {functionSignature && (
        <StyledInfoRow>
          <StyledInfoType>Function signature</StyledInfoType>
          <StyledInfoValue>{functionSignature}</StyledInfoValue>
        </StyledInfoRow>
      )}
      {parsedInput ? <ParamBlock title="Inputs" items={parsedInput} /> : null}
      {parsedOutput ? <ParamBlock title="Outputs" items={parsedOutput} /> : null}
      {parsedError ? <ParamBlock title="Error" items={parsedError} /> : null}
      <DataSection title="Events data">
        <EventBlock eventLogs={parsedEvents} />
      </DataSection>
      <DataSection title="Storage data">
        <StorageBlock storageAddress={storageAddress} storageLogs={storageLogs} />
      </DataSection>
    </DataSection>
  )
}

const CreateBlockSummary = ({ data }: CreateBlockSummaryProps) => {
  const { input, salt, storageAddress, storageLogs } = data
  return (
    <DataSection title="Create specific data">
      <StyledInfoRow>
        <StyledInfoType>Salt</StyledInfoType>
        <StyledInfoValue>{salt}</StyledInfoValue>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Raw input</StyledInfoType>
        <StyleRawBytecode>{input}</StyleRawBytecode>
      </StyledInfoRow>
      <DataSection title="Storage data">
        <StorageBlock storageAddress={storageAddress} storageLogs={storageLogs} />
      </DataSection>
    </DataSection>
  )
}

const DefaultBlockSummary = ({ data }: DefaultBlockSummaryProps) => {
  const { address, blockNumber, gasCost, passedGas, stackTrace, type, value, isSuccess } = data

  return (
    <DataSection title="Trace Information">
      <StyledInfoRow>
        <StyledInfoType>Address</StyledInfoType>
        <StyleRawBytecode>{address}</StyleRawBytecode>
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
    </DataSection>
  )
}

export const BlockSummary: React.FC<BlockSummaryProps> = () => {
  const currentBlock = useTypedSelector(selectParsedActiveBlock)

  const { callSpecificData, createSpecificData, defaultData } = currentBlock

  return (
    <StyledStack>
      {defaultData ? <DefaultBlockSummary data={defaultData} /> : null}
      {callSpecificData ? <CallBlockSummary data={callSpecificData} /> : null}
      {createSpecificData ? <CreateBlockSummary data={createSpecificData} /> : null}
    </StyledStack>
  )
}
