import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  overflow: 'auto',
  marginTop: '16px',
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
  width: '50px',
}))
export const StyledStorageValue = styled(Typography)(() => ({}))
