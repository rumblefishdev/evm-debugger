import { Dialog, Button } from '@mui/material'
import React, { useState } from 'react'

import { updateSourceCode } from '../../store/sourceCodes/sourceCodes.slice'
import { useTypedDispatch } from '../../store/storeHooks'
import { DataAdder } from '../DataAdder'

import type { ManagerItemProps } from './ManagerItem.types'
import { StyledStack, StyledName, StyledStatusFound, StyledStatusNotFound } from './styles'

export const ManagerItem = ({ isFound, name, value, ...props }: ManagerItemProps) => {
  const dispatch = useTypedDispatch()

  const [isDataVisible, setDataVisibility] = useState(false)
  const [isDataAdderVisible, setDataAdderVisibility] = useState(false)

  const dataAdderHandler = (data: string) => {
    dispatch(updateSourceCode({ id: name, changes: { sourceCode: data } }))
  }

  return (
    <StyledStack {...props}>
      <StyledName>{name}</StyledName>
      {isFound ? (
        <Button onClick={() => setDataVisibility(true)}>Show</Button>
      ) : (
        <Button variant="contained" onClick={() => setDataAdderVisibility(true)}>
          Add
        </Button>
      )}
      {isFound ? <StyledStatusFound>Found</StyledStatusFound> : <StyledStatusNotFound>Not found</StyledStatusNotFound>}
      <Dialog open={isDataVisible} onClose={() => setDataVisibility(false)}>
        {value}
      </Dialog>
      <DataAdder open={isDataAdderVisible} submithandler={dataAdderHandler} title={name} onClose={() => setDataAdderVisibility(false)} />
    </StyledStack>
  )
}
