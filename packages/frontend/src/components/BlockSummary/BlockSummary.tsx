import React, { useMemo } from 'react'
import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'
import { Stack } from '@mui/system'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
} from '@mui/material'

import { useTypedSelector } from '../../store/storeHooks'
import { selectActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import {
  parseEventLog,
  parseFunctionFragment,
  parseStackTrace,
} from '../../helpers/helpers'

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
  StyledSectionHeader,
  StyledWrapper,
  StyleRawBytecode,
} from './styles'

// Todo: handle reverted calls with errorDescription

const CallBlockSummary = ({ item, ...props }: CallBlockSummaryProps) => {
  const {
    events,
    input,
    output,
    functionFragment,
    decodedInput,
    decodedOutput,
    isContract,
  } = item

  const parsedEvents = useMemo(() => parseEventLog(events), [events])
  // const { signature, parsedOutputs, parsedInputs } = useMemo(
  //   () => parseFunctionFragment(functionFragment, decodedInput, decodedOutput),
  //   [functionFragment]
  // )

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
      {/* <StyledSectionHeader>
        Decoded Function: <b>{signature}</b>
      </StyledSectionHeader>
      <Accordion>
        <AccordionSummary>Inputs</AccordionSummary>
        <AccordionDetails>
          <List>
            {parsedInputs.map((parsedInput) => {
              return (
                <StyledInfoRow>
                  <StyledInfoType>
                    {parsedInput.name} ({parsedInput.type})
                  </StyledInfoType>
                  <StyledInfoValue>{parsedInput.value}</StyledInfoValue>
                </StyledInfoRow>
              )
            })}
          </List>
        </AccordionDetails>
      </Accordion> */}
      {/* <Accordion>
      <AccordionSummary>Outputs</AccordionSummary>
        <AccordionDetails>
          <List>
            {parsedOutputs.map((parsedOutput) => {
              return (
                <StyledInfoRow>
                  <StyledInfoType>
                    {parsedOutput.name} ({parsedOutput.type})
                  </StyledInfoType>
                  <StyledInfoValue>{parsedOutput.value}</StyledInfoValue>
                </StyledInfoRow>
              )
            })}
          </List>
        </AccordionDetails>
      </Accordion> */}
      <StyledSectionHeader>Events:</StyledSectionHeader>
      <Stack sx={{ marginBottom: '12px' }}>
        {parsedEvents.map((event, index) => {
          return (
            <Accordion>
              <AccordionSummary>{event.signature}</AccordionSummary>
              <AccordionDetails>
                <List>
                  {event.parsedArgs.map((arg) => {
                    return (
                      <StyledInfoRow>
                        <StyledInfoType>{arg.name}</StyledInfoType>
                        <StyledInfoValue>{arg.value}</StyledInfoValue>
                      </StyledInfoRow>
                    )
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Stack>
    </>
  )
}

const CreateBlockSummary = ({ item, ...props }: CreateBlockSummaryProps) => {
  const { input, isSuccess, salt } = item
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

        <StyledSectionHeader>Storage Information</StyledSectionHeader>
        <StyledInfoRow>
          <StyledInfoType>Storage address</StyledInfoType>
          <StyleRawBytecode>{storageAddress}</StyleRawBytecode>
        </StyledInfoRow>
        <Stack sx={{ marginBottom: '12px' }}>
          <Accordion>
            <AccordionSummary>Loaded Storage</AccordionSummary>
            <AccordionDetails>
              <List>
                {storageLogs.loadedStorage.map((log) => {
                  return (
                    <>
                      <StyledInfoRow>
                        <StyledInfoType>Key</StyledInfoType>
                        <StyleRawBytecode>{log.key}</StyleRawBytecode>
                      </StyledInfoRow>
                      <StyledInfoRow>
                        <StyledInfoType>Value</StyledInfoType>
                        <StyleRawBytecode>{log.value}</StyleRawBytecode>
                      </StyledInfoRow>
                    </>
                  )
                })}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>Changed Storage</AccordionSummary>
            <AccordionDetails>
              <List>
                {storageLogs.changedStorage.map((log) => {
                  return (
                    <>
                      <StyledInfoRow>
                        <StyledInfoType>Key</StyledInfoType>
                        <StyleRawBytecode>{log.key}</StyleRawBytecode>
                      </StyledInfoRow>
                      <StyledInfoRow>
                        <StyledInfoType>Initial Value</StyledInfoType>
                        <StyleRawBytecode>{log.initialValue}</StyleRawBytecode>
                      </StyledInfoRow>
                      <StyledInfoRow>
                        <StyledInfoType>Updated Value</StyledInfoType>
                        <StyleRawBytecode>{log.updatedValue}</StyleRawBytecode>
                      </StyledInfoRow>
                    </>
                  )
                })}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>Returned Storage</AccordionSummary>
            <AccordionDetails>
              <List>
                {storageLogs.returnedStorage.map((log) => {
                  return (
                    <>
                      <StyledInfoRow>
                        <StyledInfoType>Key</StyledInfoType>
                        <StyleRawBytecode>{log.key}</StyleRawBytecode>
                      </StyledInfoRow>
                      <StyledInfoRow>
                        <StyledInfoType>Value</StyledInfoType>
                        <StyleRawBytecode>{log.value}</StyleRawBytecode>
                      </StyledInfoRow>
                    </>
                  )
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </StyledWrapper>
    </StyledBox>
  )
}
