import { Dialog, Typography } from '@mui/material'
import React, { useState } from 'react'

import { useFileUploadHandler } from '../../hooks/useFileUpload'

import type { DataAdderProps } from './DataAdder.types'
import { StyledStack, StyledButton, StyledTextArea } from './styles'

export const DataAdder = ({ submithandler, title, ...props }: DataAdderProps) => {
  const [fileValue, setFile, setFileValue, isTooBig] = useFileUploadHandler()

  return (
    <Dialog {...props}>
      <StyledStack>
        <Typography>{title}</Typography>
        <StyledTextArea
          multiline
          minRows={12}
          value={isTooBig ? 'File is too big to display' : fileValue}
          onChange={(event) => setFileValue(event.target.value)}
        />
        <StyledButton component="label" variant="contained">
          Upload file
          <input type="file" hidden onChange={setFile} />
        </StyledButton>
        <StyledButton variant="contained" onClick={() => submithandler(fileValue)}>
          Submit
        </StyledButton>
      </StyledStack>
    </Dialog>
  )
}
