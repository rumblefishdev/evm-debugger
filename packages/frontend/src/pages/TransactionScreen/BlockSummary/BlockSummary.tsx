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
  const {
    functionSignature,
    isContract,
    parsedError,
    events,
    parsedOutput,
    parsedInput,
    storageAddress,
    storageLogs,
    input,
    output,
    contractName,
  } = data

  if (!isContract) return null

  return (
    <DataSection title="Call specific data">
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

      <DataSection title="Storage data">
        <StorageBlock
          storageAddress={storageAddress}
          storageLogs={storageLogs}
        />
      </DataSection>
      <StyledInfoRow>
        <StyledInfoType>Raw input</StyledInfoType>
        <StyledInfoValue>{input}</StyledInfoValue>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledInfoType>Raw output</StyledInfoType>
        <StyledInfoValue>{output}</StyledInfoValue>
      </StyledInfoRow>
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
        <StyledInfoValue>{input}</StyledInfoValue>
      </StyledInfoRow>
      <DataSection title="Storage data">
        <StorageBlock
          storageAddress={storageAddress}
          storageLogs={storageLogs}
        />
      </DataSection>
    </DataSection>
  )
}

const DefaultBlockSummary = ({ data }: DefaultBlockSummaryProps) => {
  const { address, blockNumber, gasCost, passedGas, stackTrace, op, value, isSuccess } = data

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
    startIndex,
    stackTrace,
    returnIndex,
    passedGas,
    op,
    isSuccess,
    gasCost,
    blockNumber,
    address,
  }

  const callSpecificData: CallBlockSummaryProps['data'] = {
    storageLogs,
    storageAddress,
    parsedOutput,
    parsedInput,
    parsedError,
    output,
    isContract,
    input,
    functionSignature,
    events,
    errorSignature,
    contractName,
  }

  const createSpecificData: CreateBlockSummaryProps['data'] = {
    storageLogs,
    storageAddress,
    salt: createTypeData?.salt,
    input,
  }

  return (
    <StyledStack>
      {defaultBlockSummaryProps ? <DefaultBlockSummary data={defaultBlockSummaryProps} /> : null}
      {callSpecificData ? <CallBlockSummary data={callSpecificData} /> : null}
      {createSpecificData ? <CreateBlockSummary data={createSpecificData} /> : null}
    </StyledStack>
  )
}
