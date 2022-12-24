import React from 'react'

import { selectStructlogStorage } from '../../store/structlogs/structlogs.slice'
import { useTypedSelector } from '../../store/storeHooks'
import { StructlogAcordionPanel } from '../StructlogAcordionPanel'

import type { StorageInfoCardProps } from './StorageInfoCard.types'
import {
  StyledStorageIndex,
  StyledStack,
  StyledStorageItem,
  StyledStorageItemRecord,
  StyledStorageValue,
} from './styles'

export const StorageInfoCard = ({ ...props }: StorageInfoCardProps) => {
  const storage = useTypedSelector(selectStructlogStorage)

  const keys = Object.keys(storage)

  return (
    <StructlogAcordionPanel text="Storage" canExpand={keys.length > 0}>
      <StyledStack {...props}>
        {keys.map((key, index) => {
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
    </StructlogAcordionPanel>
  )
}
