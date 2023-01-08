import { List } from '@mui/material'
import React from 'react'

import { StyledBlockWrapper } from '../../styles'
import { StyledInfoRow, StyledInfoType, StyleRawBytecode, StyledAccordion, StyledAccordionSummary, StyledAccordionDetails } from '../styles'

import type { StorageBlockProps } from './Storage.types'

export const StorageBlock = ({ storageAddress, storageLogs }: StorageBlockProps) => {
  const { changedStorage, loadedStorage, returnedStorage } = storageLogs

  return (
    <>
      <StyledInfoRow>
        <StyledInfoType>Storage address</StyledInfoType>
        <StyleRawBytecode>{storageAddress}</StyleRawBytecode>
      </StyledInfoRow>
      <StyledBlockWrapper>
        {loadedStorage.length > 0 && (
          <StyledAccordion>
            <StyledAccordionSummary>Loaded Storage</StyledAccordionSummary>
            <StyledAccordionDetails>
              <List>
                {loadedStorage.map((log, index) => {
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
        )}
        {changedStorage.length > 0 && (
          <StyledAccordion>
            <StyledAccordionSummary>Changed Storage</StyledAccordionSummary>
            <StyledAccordionDetails>
              <List>
                {changedStorage.map((log, index) => {
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
        )}
        {returnedStorage.length > 0 && (
          <StyledAccordion>
            <StyledAccordionSummary>Returned Storage</StyledAccordionSummary>
            <StyledAccordionDetails>
              <List>
                {returnedStorage.map((log, index) => {
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
        )}
      </StyledBlockWrapper>
    </>
  )
}
