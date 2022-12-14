import type { ButtonProps } from '@mui/material'
import { Button } from '@mui/material'
import React, { useState } from 'react'

import { updateSourceCode } from '../../store/sourceCodes/sourceCodes.slice'
import { useTypedDispatch } from '../../store/storeHooks'
import { ContentShowPopup } from '../ContentShowPopup'
import { DataAdder } from '../DataAdder'

import type { ManagerItemProps } from './ManagerItem.types'
import { StyledStack, StyledName, StyledStatusFound, StyledStatusNotFound } from './styles'

const ButtonShow = ({ ...props }: ButtonProps) => (
  <Button variant="outlined" {...props}>
    Show
  </Button>
)

export const ManagerItem = ({ isFound, name, value, updateItem, ...props }: ManagerItemProps) => {
  const [isDataVisible, setDataVisibility] = useState(false)
  const [isDataAdderVisible, setDataAdderVisibility] = useState(false)

  const dataAdderHandler = (data: string) => {
    const dispatch = useTypedDispatch()
    dispatch(updateSourceCode({ id: name, changes: { sourceCode: data } }))
  }

  return (
    <StyledStack {...props}>
      <StyledName>{name}</StyledName>
      {isFound ? (
        <ButtonShow onClick={() => setDataVisibility(true)} />
      ) : (
        <Button variant="contained" onClick={() => setDataAdderVisibility(true)}>
          Add
        </Button>
      )}
      {isFound ? <StyledStatusFound>Found</StyledStatusFound> : <StyledStatusNotFound>Not found</StyledStatusNotFound>}
      <ContentShowPopup open={isDataVisible} onClose={() => setDataVisibility(false)} popupData={value} />
      <DataAdder open={isDataAdderVisible} submithandler={dataAdderHandler} title={name} onClose={() => setDataAdderVisibility(false)} />
    </StyledStack>
  )
}
