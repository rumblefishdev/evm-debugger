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
  StyledTextAreaWrapper,
  StyledButtonText,
} from './styles'

export const DataAdder = ({ submithandler, onClose, title, description, ...props }: DataAdderProps) => {
  const [fileValue, uploadFile, setFileValue, isTooBig] = useFileUploadHandler()

  const inputValue = isTooBig ? 'File is too big to display' : fileValue

  return (
    <StyledDialog
      PaperProps={{
        style: {
          overflow: 'hidden',
          boxShadow: 'none',
          borderRadius: '24px',
          background:
            'radial-gradient(102.78% 104.72% at -0.77% 0%, rgba(255, 255, 255, 0.075) 0%, rgba(255, 255, 255, 0) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */, rgba(255, 255, 255, 0.01)',
        },
      }}
      {...props}
      onClose={onClose}
    >
      <StyledStack>
        <StyledHeader>
          <StyledTitle>{title}</StyledTitle>
          {description ? <StyledDescription>{description}</StyledDescription> : null}
        </StyledHeader>
        <StyledTextAreaWrapper>
          <StyledInputLabel>
            Code<StyledInputLabelStar component="span">*</StyledInputLabelStar>
          </StyledInputLabel>
          <StyledTextArea
            multiline
            minRows={12}
            value={inputValue}
            onChange={(event) => setFileValue(event.target.value)}
          />
        </StyledTextAreaWrapper>

        <StyledButtonWrapper>
          <StyledButton
            variant="outlined"
            component="label"
            // sx={{ textAlign: 'center', paddingRight: 0, paddingLeft: 0 }}
          >
            <StyledButtonText>Upload file</StyledButtonText>
            <input
              type="file"
              hidden
              onChange={uploadFile}
            />
          </StyledButton>
          <StyledButton
            onClick={() => submithandler(fileValue)}
            variant="outlined"
            component="label"
            sx={{ color: '#070706', backgroundColor: '#FFFFFF' }}
          >
            <StyledButtonText>Submit</StyledButtonText>
            <input
              type="file"
              hidden
              onChange={uploadFile}
            />
          </StyledButton>
        </StyledButtonWrapper>
      </StyledStack>
    </StyledDialog>
  )
}
