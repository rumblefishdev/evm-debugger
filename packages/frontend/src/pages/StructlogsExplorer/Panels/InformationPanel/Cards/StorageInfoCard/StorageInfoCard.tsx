import React from 'react'
import { Stack } from '@mui/material'
import { useSelector } from 'react-redux'

import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import { StyledRecord, StyledRecordType, StyledRecordValue, StyledWrapper } from '../styles'
import { structlogsSelectors } from '../../../../../../store/structlogs/structlogs.selectors'

import type { StorageInfoCardProps } from './StorageInfoCard.types'

export const StorageInfoCard = ({ ...props }: StorageInfoCardProps) => {
  const storage = useSelector(structlogsSelectors.selectStructlogStorage)
  const keys = Object.keys(storage)
  return (
    <StructlogAcordionPanel
      text="Storage"
      canExpand={keys.length > 0}
    >
      <StyledWrapper {...props}>
        {keys.map((key, index) => {
          return (
            <Stack key={index}>
              <StyledRecord>
                <StyledRecordType>Key: </StyledRecordType>
                <StyledRecordValue>{key}</StyledRecordValue>
              </StyledRecord>
              <StyledRecord>
                <StyledRecordType>Value: </StyledRecordType>
                <StyledRecordValue>{storage[key]}</StyledRecordValue>
              </StyledRecord>
            </Stack>
          )
        })}
      </StyledWrapper>
    </StructlogAcordionPanel>
  )
}
