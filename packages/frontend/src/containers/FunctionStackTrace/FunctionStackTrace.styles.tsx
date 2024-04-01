import { Stack, Typography, styled } from '@mui/material'

export const StyledFunctionStackTraceContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(7),
  height: '100%',
  boxSizing: 'border-box',
  backgroundColor: 'white',
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  //   marginBottom: theme.spacing(3),
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  color: theme.palette.rfSecondary,
}))

export const StyledButtonsWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledListWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflowY: 'auto',
  overflowX: 'auto',
  height: '100%',
  ...theme.customStyles.scrollbar,
  gap: theme.spacing(0.5),
}))
