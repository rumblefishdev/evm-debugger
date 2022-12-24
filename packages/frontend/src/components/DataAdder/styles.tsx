import { Button, Input, Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  width: '480px',
  padding: '16px',
  overflow: 'hidden',
  maxHeight: '640px',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledTextArea = styled(Input)(() => ({
  width: '420px',
  overflow: 'auto',
  margin: '8px 0',
  height: '420px',

  '& textarea': {
    alignSelf: 'baseline',
  },
}))

export const StyledButton = styled(Button)<{ component?: 'label' }>(() => ({
  width: '152px',
  padding: '8px 12px',
  margin: '8px 0',
  fontSize: '14px',
}))
