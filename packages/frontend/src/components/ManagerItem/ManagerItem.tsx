import { useState } from 'react'
import { Tooltip } from '@mui/material'

import { Button } from '../Button'
import { DataAdder } from '../DataAdder'
import { TransactionContentDialog } from '../TransactionContentDialog'

import type { ManagerItemProps } from './ManagerItem.types'
import { StyledStack, StyledName, StyledStatusFound, StyledStatusNotFound } from './styles'

export const ManagerItem = ({ isFound, address, name, value, updateItem, contentType, ...props }: ManagerItemProps) => {
  const [isDataVisible, setDataVisibility] = useState(false)
  const [isDataAdderVisible, setDataAdderVisibility] = useState(false)

  const dataAdderHandler = (data: string) => {
    updateItem(name, data)
    setDataAdderVisibility(false)
  }

  return (
    <StyledStack {...props}>
      {isFound ? <StyledStatusFound>Found</StyledStatusFound> : <StyledStatusNotFound>Not found</StyledStatusNotFound>}
      <Tooltip
        title={address}
        arrow
        followCursor
      >
        <StyledName>{name || address}</StyledName>
      </Tooltip>
      <Button
        variant="text"
        size="medium"
        onClick={isFound ? () => setDataVisibility(true) : () => setDataAdderVisibility(true)}
      >
        {isFound ? 'Show' : 'Add'}
      </Button>
      {isFound ? (
        <TransactionContentDialog
          title={name}
          description={address}
          content={value}
          contentType={contentType}
          open={isDataVisible}
          onClose={() => setDataVisibility(false)}
        />
      ) : (
        <DataAdder
          open={isDataAdderVisible}
          submithandler={dataAdderHandler}
          title={`Upload for ${name}`}
          onClose={() => setDataAdderVisibility(false)}
          description={address}
        />
      )}
    </StyledStack>
  )
}
