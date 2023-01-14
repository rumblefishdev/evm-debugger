import { Stack, styled, Typography } from '@mui/material'

export const StyledWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflow: 'auto',
  height: '100%',
  gap: theme.spacing(2),
}))

export const StyledRecord = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledRecordType = styled(Typography)(({ theme }) => ({
  width: '72px',
  textAlign: 'right',
  marginRight: theme.spacing(4),
  fontWeight: 500,
  fontSize: '13px',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))

export const StyledRecordValue = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '13px',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))
