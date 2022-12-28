import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Stack,
} from '@mui/material'
import React from 'react'

import {
  StyledInfoRow,
  StyledInfoType,
  StyledSectionHeader,
  StyleRawBytecode,
} from '../../styles'

import type { StorageBlockProps } from './Storage.types'

export const StorageBlock = ({
  storageAddress,
  storageLogs,
}: StorageBlockProps) => {
  return (
    <>
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
    </>
  )
}
