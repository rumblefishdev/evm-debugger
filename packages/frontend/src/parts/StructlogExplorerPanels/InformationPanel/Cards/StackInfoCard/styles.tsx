import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  overflow: 'auto',
  marginTop: '16px',
  height: '100%',
}))

export const StyledRecordIndex = styled(Typography)(() => ({
  width: '96px',
  textAlign: 'right',
  marginRight: '16px',
  fontFamily: 'roboto mono',
}))
export const StyledRecordValue = styled(Typography)(() => ({
  fontFamily: 'roboto mono',
}))

export const StyledRecord = styled(Stack)(() => ({
  width: '95%',
  marginBottom: '4px',

  flexDirection: 'row',
  alignItems: 'center',
}))
