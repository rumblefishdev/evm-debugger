import { Stack, styled, Typography } from '@mui/material'

export const StyledCard = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  height: '100%',
  boxSizing: 'border-box',

  borderRadius: '0.5rem',
  border: `1px solid #e5e5e5`,
}))

export const StyledCardHeadingWrapper = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  gap: theme.spacing(2),
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledCardHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  fontSize: '18px',
  color: theme.palette.rfSecondary,
}))

export const StyledWrapper = styled(Stack)(({ theme }) => ({
  overflowY: 'auto',
  overflowX: 'auto',
  height: '100%',
  gap: theme.spacing(1),
  flex: 1,
  ...theme.customStyles.scrollbar,
}))

export const StyledRecord = styled(Stack)(() => ({
  textAlign: 'left',
  flexWrap: 'wrap',
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
