import { Dialog, Button } from '@mui/material'
import React, { useState } from 'react'

import { DataAdder } from '../DataAdder'

import type { ManagerItemProps } from './ManagerItem.types'
import {
  StyledStack,
  StyledName,
  StyledStatusFound,
  StyledStatusNotFound,
} from './styles'

export const ManagerItem = ({
  isFound,
  name,
  value,
  updateItem,
  ...props
}: ManagerItemProps) => {
  const [isDataVisible, setDataVisibility] = useState(false)
  const [isDataAdderVisible, setDataAdderVisibility] = useState(false)

  const dataAdderHandler = (data: string) => {
    updateItem(name, data)
    setDataAdderVisibility(false)
  }

  return (
    <StyledStack {...props}>
      <StyledName>{name}</StyledName>
      {isFound ? (
        <Button onClick={() => setDataVisibility(true)}>Show</Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => setDataAdderVisibility(true)}
        >
          Add
        </Button>
      )}
      {isFound ? (
        <StyledStatusFound>Found</StyledStatusFound>
      ) : (
        <StyledStatusNotFound>Not found</StyledStatusNotFound>
      )}
      <Dialog open={isDataVisible} onClose={() => setDataVisibility(false)}>
        <pre>{value}</pre>
      </Dialog>
      <DataAdder
        open={isDataAdderVisible}
        submithandler={dataAdderHandler}
        title={name}
        onClose={() => setDataAdderVisibility(false)}
      />
    </StyledStack>
  )
}