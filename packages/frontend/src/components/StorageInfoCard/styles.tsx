import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  overflow: 'auto',
  marginTop: '16px',
  height: '100%',
}))

export const StyledStorageItem = styled(Stack)(() => ({
  width: '95%',
  marginBottom: '8px',
  flexDirection: 'column',
}))

export const StyledStorageItemRecord = styled(Stack)(() => ({
  flexDirection: 'row',
}))

export const StyledStorageIndex = styled(Typography)(() => ({
  width: '64px',
  marginRight: '16px',
  fontFamily: 'roboto mono',
}))
export const StyledStorageValue = styled(Typography)(() => ({
  fontFamily: 'roboto mono',
}))
