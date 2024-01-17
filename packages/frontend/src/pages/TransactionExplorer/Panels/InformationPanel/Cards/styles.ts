import { Stack, styled, Typography } from '@mui/material'

export const StyledWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflowY: 'auto',
  overflowX: 'auto',
  height: '100%',
  gap: theme.spacing(1),
  ...theme.customStyles.scrollbar,
}))

export const StyledRecord = styled(Stack)(() => ({
  textAlign: 'left',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledRecordType = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  minWidth: '72px',
  marginRight: theme.spacing(4),
  fontWeight: 500,
  fontSize: '13px',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))

export const StyledRecordValue = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  marginRight: 'auto',
  fontWeight: 400,
  fontSize: '13px',
  fontFamily: 'IBM Plex Mono',
  color: theme.palette.rfSecondary,
}))
