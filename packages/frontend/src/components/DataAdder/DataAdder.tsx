import { Typography } from '@mui/material'

import { useFileUploadHandler } from '../../hooks/useFileUpload'

import type { DataAdderProps } from './DataAdder.types'
import {
  StyledStack,
  StyledButton,
  StyledTextArea,
  StyledTitle,
  StyledHeader,
  StyledDescription,
  StyledButtonWrapper,
  StyledDialog,
  StyledInputLabel,
  StyledInputLabelStar,
} from './styles'

export const DataAdder = ({
  submithandler,
  onClose,
  title,
  description,
  ...props
}: DataAdderProps) => {
  const [fileValue, uploadFile, setFileValue, isTooBig] = useFileUploadHandler()

  const inputValue = isTooBig ? 'File is too big to display' : fileValue

  return (
    <StyledDialog {...props} onClose={onClose}>
      <StyledStack>
        <StyledHeader>
          <StyledTitle>{title}</StyledTitle>
          {description ? (
            <StyledDescription>{description}</StyledDescription>
          ) : null}
        </StyledHeader>
        <StyledInputLabel>
          Code<StyledInputLabelStar component="span">*</StyledInputLabelStar>
        </StyledInputLabel>
        <StyledTextArea
          multiline
          minRows={12}
          value={inputValue}
          onChange={(event) => setFileValue(event.target.value)}
        />
        <StyledButtonWrapper>
          <StyledButton
            variant="outlined"
            component="label"
            sx={{ textAlign: 'center', paddingRight: 0, paddingLeft: 0 }}
          >
            Upload file
            <input type="file" hidden onChange={uploadFile} />
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={() => submithandler(fileValue)}
          >
            Submit
          </StyledButton>
        </StyledButtonWrapper>
      </StyledStack>
    </StyledDialog>
  )
}
