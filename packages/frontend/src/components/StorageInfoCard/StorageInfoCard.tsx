import React from 'react'

import { selectStructlogStorage } from '../../store/structlogs/structlogs.slice'
import { useTypedSelector } from '../../store/storeHooks'

import type { StorageInfoCardProps } from './StorageInfoCard.types'
import { StyledStorageIndex, StyledStack, StyledStorageItem, StyledStorageItemRecord, StyledStorageValue } from './styles'

export const StorageInfoCard = ({ ...props }: StorageInfoCardProps) => {
  const storage = useTypedSelector(selectStructlogStorage)

  return (
    <StyledStack {...props}>
      {Object.keys(storage).map((key, index) => {
        return (
          <StyledStorageItem key={index}>
            <StyledStorageItemRecord>
              <StyledStorageIndex>Key: </StyledStorageIndex>
              <StyledStorageValue>{key}</StyledStorageValue>
            </StyledStorageItemRecord>
            <StyledStorageItemRecord>
              <StyledStorageIndex>Value: </StyledStorageIndex>
              <StyledStorageValue>{storage[key]}</StyledStorageValue>
            </StyledStorageItemRecord>
          </StyledStorageItem>
        )
      })}
    </StyledStack>
  )
}
