import React from 'react'
import { Stack } from '@mui/material'

import { selectStructlogStorage } from '../../../../../../store/structlogs/structlogs.slice'
import { useTypedSelector } from '../../../../../../store/storeHooks'
import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import { StyledRecord, StyledRecordType, StyledRecordValue, StyledWrapper } from '../styles'

import type { StorageInfoCardProps } from './StorageInfoCard.types'

export const StorageInfoCard = ({ ...props }: StorageInfoCardProps) => {
  const storage = useTypedSelector(selectStructlogStorage)

  const keys = Object.keys(storage)

  return (
    <StructlogAcordionPanel text="Storage" canExpand={keys.length > 0}>
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
