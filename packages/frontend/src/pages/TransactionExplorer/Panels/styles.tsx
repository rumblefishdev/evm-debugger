import { Stack, styled, Typography } from '@mui/material'

export const StyledPanel = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  height: '100%',
  boxSizing: 'border-box',
  boxShadow: '0px 0px 8px 0px rgba(0, 10, 108, 0.2)',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(1.5),
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  color: theme.palette.rfSecondary,
}))

export const StyledListWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflow: 'auto',
  height: '100%',
  ...theme.customStyles.scrollbar,
}))
