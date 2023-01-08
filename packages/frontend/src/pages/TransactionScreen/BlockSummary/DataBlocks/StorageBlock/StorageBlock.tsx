import { List, Stack } from '@mui/material'
import React from 'react'

import { StyledInfoRow, StyledInfoType, StyleRawBytecode, StyledAccordion, StyledAccordionSummary, StyledAccordionDetails } from '../styles'

import type { StorageBlockProps } from './Storage.types'

export const StorageBlock = ({ storageAddress, storageLogs }: StorageBlockProps) => {
  return (
    <>
      <StyledInfoRow>
        <StyledInfoType>Storage address</StyledInfoType>
        <StyleRawBytecode>{storageAddress}</StyleRawBytecode>
      </StyledInfoRow>
      <Stack>
        <StyledAccordion>
          <StyledAccordionSummary>Loaded Storage</StyledAccordionSummary>
          <StyledAccordionDetails>
            <List>
              {storageLogs.loadedStorage.map((log, index) => {
                return (
                  <React.Fragment key={index}>
                    <StyledInfoRow>
                      <StyledInfoType>Key</StyledInfoType>
                      <StyleRawBytecode>{log.key}</StyleRawBytecode>
                    </StyledInfoRow>
                    <StyledInfoRow>
                      <StyledInfoType>Value</StyledInfoType>
                      <StyleRawBytecode>{log.value}</StyleRawBytecode>
                    </StyledInfoRow>
                  </React.Fragment>
                )
              })}
            </List>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion>
          <StyledAccordionSummary>Changed Storage</StyledAccordionSummary>
          <StyledAccordionDetails>
            <List>
              {storageLogs.changedStorage.map((log, index) => {
                return (
                  <React.Fragment key={index}>
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
                  </React.Fragment>
                )
              })}
            </List>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion>
          <StyledAccordionSummary>Returned Storage</StyledAccordionSummary>
          <StyledAccordionDetails>
            <List>
              {storageLogs.returnedStorage.map((log, index) => {
                return (
                  <React.Fragment key={index}>
                    <StyledInfoRow>
                      <StyledInfoType>Key</StyledInfoType>
                      <StyleRawBytecode>{log.key}</StyleRawBytecode>
                    </StyledInfoRow>
                    <StyledInfoRow>
                      <StyledInfoType>Value</StyledInfoType>
                      <StyleRawBytecode>{log.value}</StyleRawBytecode>
                    </StyledInfoRow>
                  </React.Fragment>
                )
              })}
            </List>
          </StyledAccordionDetails>
        </StyledAccordion>
      </Stack>
    </>
  )
}
