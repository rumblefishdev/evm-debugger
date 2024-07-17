import React from 'react'
import { Tooltip, Stack } from '@mui/material'

import { Button } from '../UiButton'
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
          <Stack sx={{ flexDirection: 'row', display: 'flex' }}>
            <StyledLabel>Upload Result of</StyledLabel>
            {isUploaded && !isError && <TickFilledBlue style={{ height: '12px' }} />}
            {isError && (
              <Tooltip title={errorMessage}>
                <Error style={{ height: '10px' }} />
              </Tooltip>
            )}
          </Stack>

          <StyledTitle>{uploadInfo}</StyledTitle>
        </StyledTextWrapper>
      </IconWrapper>
      <Button
        onClick={openHandler}
        variant="contained"
        size="small"
        sx={{ fontWeight: 400, borderRadius: '16px' }}
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
