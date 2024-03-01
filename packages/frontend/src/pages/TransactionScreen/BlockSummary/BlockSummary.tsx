// TODO: Refactor this component to better work with new structure

import React from 'react'
import { useSelector } from 'react-redux'

import { activeBlockSelectors } from '../../../store/activeBlock/activeBlock.selector'

import type { BlockSummaryProps, CallBlockSummaryProps, CreateBlockSummaryProps, DefaultBlockSummaryProps } from './BlockSummary.types'
import { StyledBlockWrapper, StyledInfoRow, StyledInfoType, StyledStack, StyledInfoValue } from './styles'
import { ParamBlock } from './DataBlocks/ParamBlock'
import { StorageBlock } from './DataBlocks/StorageBlock'
import { EventBlock } from './DataBlocks/EventBlock'
import { DataSection } from './DataSection'

const CallBlockSummary = ({ data }: CallBlockSummaryProps) => {
  const { functionSignature, parsedError, events, parsedInput, parsedOutput } = data

  return (
    <DataSection title="Call specific data">
      {functionSignature && (
        <StyledInfoRow>
          <StyledInfoType>Function signature</StyledInfoType>
          <StyledInfoValue>{functionSignature}</StyledInfoValue>
        </StyledInfoRow>
      )}
      <StyledBlockWrapper>
        {parsedInput && parsedInput.length > 0 && (
          <ParamBlock
            title="Inputs"
            items={parsedInput}
          />
        )}
        {parsedOutput && parsedOutput.length > 0 && (
          <ParamBlock
            title="Outputs"
            items={parsedOutput}
          />
        )}
        {parsedError && parsedError.length > 0 && (
          <ParamBlock
            title="Error"
            items={parsedError}
          />
        )}
      </StyledBlockWrapper>
      {events && events.length > 0 && (
        <DataSection title="Events data">
          <EventBlock eventLogs={events} />
        </DataSection>
      )}
    </DataSection>
  )
}

const CreateBlockSummary = ({ data }: CreateBlockSummaryProps) => {
  const { salt } = data
  return (
    <DataSection title="Create specific data">
      <StyledInfoRow>
        <StyledInfoType>Salt</StyledInfoType>
        <StyledInfoValue>{salt}</StyledInfoValue>
      </StyledInfoRow>
    </DataSection>
  )
}

const DefaultBlockSummary = ({ data }: DefaultBlockSummaryProps) => {
  const {
    address,
    blockNumber,
    gasCost,
    passedGas,
    stackTrace,
    op,
    value,
    isSuccess,
    contractName,
    input,
    isContract,
    output,
    storageAddress,
    storageLogs,
  } = data

  return (
    <DataSection title="Trace Information">
      <StyledInfoRow>
        <StyledInfoType>Address</StyledInfoType>
        <StyledInfoValue>{address}</StyledInfoValue>
      </StyledInfoRow>
      {(isSuccess === true || isSuccess === false) && (
        <StyledInfoRow>
          <StyledInfoType>Is Success</StyledInfoType>
          <StyledInfoValue>{isSuccess ? 'true' : 'false'}</StyledInfoValue>
        </StyledInfoRow>
      )}
      <StyledInfoRow>
        <StyledInfoType>Is contract</StyledInfoType>
        <StyledInfoValue>{isContract ? 'true' : 'false'}</StyledInfoValue>
      </StyledInfoRow>
      {contractName && (
        <StyledInfoRow>
          <StyledInfoType>Contract name</StyledInfoType>
          <StyledInfoValue>{contractName}</StyledInfoValue>
        </StyledInfoRow>
      )}
      <StyledInfoRow>
        <StyledInfoType>Type</StyledInfoType>
        <StyledInfoValue>{op}</StyledInfoValue>
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

      <StyledInfoRow>
        <StyledInfoType>Raw input</StyledInfoType>
        <StyledInfoValue>{input}</StyledInfoValue>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Raw output</StyledInfoType>
        <StyledInfoValue>{output}</StyledInfoValue>
      </StyledInfoRow>
      {storageLogs && (
        <DataSection title="Storage data">
          <StorageBlock
            storageAddress={storageAddress}
            storageLogs={storageLogs}
          />
        </DataSection>
      )}
    </DataSection>
  )
}

export const BlockSummary: React.FC<BlockSummaryProps> = () => {
  const currentBlock = useSelector(activeBlockSelectors.selectParsedActiveBlock)

  const {
    address,
    callTypeData,
    gasCost,
    input,
    op,
    passedGas,
    stackTrace,
    startIndex,
    value,
    blockNumber,
    createTypeData,
    isContract,
    isSuccess,
    returnIndex,
    storageAddress,
    storageLogs,
    output,
  } = currentBlock

  const { errorSignature, events, functionSignature, parsedError, parsedInput, parsedOutput, contractName } = callTypeData

  const defaultBlockSummaryProps: DefaultBlockSummaryProps['data'] = {
    value,
    storageLogs,
    storageAddress,
    startIndex,
    stackTrace,
    returnIndex,
    passedGas,
    output,
    op,
    isSuccess,
    isContract,
    input,
    gasCost,
    contractName,
    blockNumber,
    address,
  }

  const callSpecificData: CallBlockSummaryProps['data'] = {
    parsedOutput,
    parsedInput,
    parsedError,
    functionSignature,
    events,
    errorSignature,
  }

  const createSpecificData: CreateBlockSummaryProps['data'] = {
    salt: createTypeData?.salt,
  }

  return (
    <StyledStack>
      {defaultBlockSummaryProps && <DefaultBlockSummary data={defaultBlockSummaryProps} />}
      {callTypeData?.functionSignature && <CallBlockSummary data={callSpecificData} />}
      {createTypeData && <CreateBlockSummary data={createSpecificData} />}
    </StyledStack>
  )
}
