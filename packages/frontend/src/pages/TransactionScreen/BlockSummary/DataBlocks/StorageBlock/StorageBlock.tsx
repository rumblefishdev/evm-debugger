import { List } from '@mui/material'
import React from 'react'

import { StyledBlockWrapper } from '../../styles'
import {
  StyledInfoRow,
  StyledInfoType,
  StyledInfoValue,
  StyledAccordion,
  StyledAccordionSummary,
  StyledAccordionDetails,
} from '../styles'

import type { StorageBlockProps } from './Storage.types'

export const StorageBlock = ({
  storageAddress,
  storageLogs,
}: StorageBlockProps) => {
  const { changedStorage, loadedStorage, returnedStorage } = storageLogs

  return (
    <>
      <StyledInfoRow>
        <StyledInfoType>Storage address</StyledInfoType>
        <StyledInfoValue>{storageAddress}</StyledInfoValue>
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
                        <StyledInfoValue>{log.key}</StyledInfoValue>
                      </StyledInfoRow>
                      <StyledInfoRow>
                        <StyledInfoType>Value</StyledInfoType>
                        <StyledInfoValue>{log.value}</StyledInfoValue>
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
                        <StyledInfoValue>{log.key}</StyledInfoValue>
                      </StyledInfoRow>
                      <StyledInfoRow>
                        <StyledInfoType>Initial Value</StyledInfoType>
                        <StyledInfoValue>{log.initialValue}</StyledInfoValue>
                      </StyledInfoRow>
                      <StyledInfoRow>
                        <StyledInfoType>Updated Value</StyledInfoType>
                        <StyledInfoValue>{log.updatedValue}</StyledInfoValue>
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
                        <StyledInfoValue>{log.key}</StyledInfoValue>
                      </StyledInfoRow>
                      <StyledInfoRow>
                        <StyledInfoType>Value</StyledInfoType>
                        <StyledInfoValue>{log.value}</StyledInfoValue>
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
