import React from 'react'

import type { StorageInfoCardProps } from './StorageInfoCard.types'
import { StyledStack } from './styles'

export const StorageInfoCard = ({ storage, ...props }: StorageInfoCardProps) => {
  return (
    <StyledStack {...props}>
      {Object.keys(storage).map((key, index) => {
        return (
          <div key={index}>
            {key}: {storage[key]}
          </div>
        )
      })}
    </StyledStack>
  )
}
