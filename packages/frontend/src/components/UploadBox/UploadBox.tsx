import React from 'react'
import { Stack } from '@mui/system'

import { Button } from '../Button'
import { TickFilledBlue, Error } from '../../icons'
import { safeJsonParse } from '../../helpers/helpers'
import { DataAdder } from '../DataAdder'

import type { UploadStackProps } from './UploadBox.types'
import { IconWrapper, StyledLabel, StyledStack, StyledTextWrapper, StyledTitle } from './styles'

export const UploadBox = ({ isUploaded, isWrongFile, onChange, onBlur, title, uploadInfo, ...props }: UploadStackProps) => {
  const [isOpen, setOpen] = React.useState<boolean>(false)

  const submitHandler = (data: string) => {
    onChange(safeJsonParse(data))
    setOpen(false)
    onBlur()
  }

  const onClose = () => {
    setOpen(false)
    onBlur()
  }

  const openHandler = () => {
    setOpen(true)
  }

  return (
    <StyledStack {...props}>
      <IconWrapper>
        {isUploaded && !isWrongFile && <TickFilledBlue />}
        {isWrongFile && <Error />}
        <StyledTextWrapper>
          <StyledLabel>Upload Result of</StyledLabel>
          <StyledTitle>{uploadInfo}</StyledTitle>
        </StyledTextWrapper>
      </IconWrapper>
      <Button variant="outlined" onClick={openHandler}>
        Add
      </Button>
      <DataAdder title={title} submithandler={submitHandler} open={isOpen} onClose={onClose} />
    </StyledStack>
  )
}
