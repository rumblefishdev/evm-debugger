import { Box, Stack, styled, Typography } from '@mui/material'

export const StyledBox = styled(Box)(() => ({
  height: '100%',
}))

export const StyledStack = styled(Stack)(() => ({
  marginTop: '16px',
}))

export const StyledRecordIndex = styled(Typography)(() => ({
  marginRight: '16px',
}))

export const StyledRecord = styled(Stack)(() => ({
  width: '95%',
  marginBottom: '4px',
  flexDirection: 'row',
  alignItems: 'center',
}))
