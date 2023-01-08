import { Dialog } from '@mui/material'
import React, { useState } from 'react'

import { Button } from '../Button'
import { DataAdder } from '../DataAdder'
import { RawDataDisplayer } from '../RawDataDisplayer'

import type { ManagerItemProps } from './ManagerItem.types'
import { StyledStack, StyledName, StyledStatusFound, StyledStatusNotFound } from './styles'

export const ManagerItem = ({ isFound, address, name, value, updateItem, ...props }: ManagerItemProps) => {
  const [isDataVisible, setDataVisibility] = useState(false)
  const [isDataAdderVisible, setDataAdderVisibility] = useState(false)

  const dataAdderHandler = (data: string) => {
    updateItem(name, data)
    setDataAdderVisibility(false)
  }

  return (
    <StyledStack {...props}>
      {isFound ? <StyledStatusFound>Found</StyledStatusFound> : <StyledStatusNotFound>Not found</StyledStatusNotFound>}
      <StyledName>{name}</StyledName>
      {isFound ? (
        <Button variant="text" onClick={() => setDataVisibility(true)}>
          Show
        </Button>
      ) : (
        <Button variant="text" onClick={() => setDataAdderVisibility(true)}>
          Add
        </Button>
      )}

      <RawDataDisplayer title={name} description={address} data={value} open={isDataVisible} onClose={() => setDataVisibility(false)} />
      <DataAdder
        open={isDataAdderVisible}
        submithandler={dataAdderHandler}
        title={`Upload for ${name}`}
        onClose={() => setDataAdderVisibility(false)}
        description={address}
      />
    </StyledStack>
  )
}
