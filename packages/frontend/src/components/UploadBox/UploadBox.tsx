import React from 'react'
import { Tooltip, Stack } from '@mui/material'

import { Button } from '../../importedComponents/components/Button'
import { TickFilledBlue, Error } from '../../icons'
import { safeJsonParse } from '../../helpers/helpers'
import { DataAdder } from '../DataAdder'

import type { UploadStackProps } from './UploadBox.types'
import { IconWrapper, StyledLabel, StyledStack, StyledTextWrapper, StyledTitle } from './styles'

export const UploadBox = ({ isUploaded, isError, errorMessage, onChange, onBlur, title, uploadInfo, ...props }: UploadStackProps) => {
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
        <StyledTextWrapper>
          <Stack sx={{ gap: '6px', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            {isUploaded && !isError && <TickFilledBlue />}
            {isError && (
              <Tooltip title={errorMessage}>
                <Error />
              </Tooltip>
            )}
            <StyledLabel>Upload Result of</StyledLabel>
          </Stack>

          <StyledTitle>{uploadInfo}</StyledTitle>
        </StyledTextWrapper>
      </IconWrapper>
      <Button
        onClick={openHandler}
        variant="contained"
        size="small"
        sx={{ maxWidth: '288px', fontWeight: 300, borderRadius: '16px' }}
      >
        Add
      </Button>
      <DataAdder
        title={title}
        submithandler={submitHandler}
        open={isOpen}
        onClose={onClose}
      />
    </StyledStack>
  )
}
