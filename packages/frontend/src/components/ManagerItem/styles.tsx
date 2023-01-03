import { Stack, styled, Typography } from '@mui/material'

const StyledStatus = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  ...theme.typography.caption,
  width: '100%',
  maxWidth: '80px',
  color: theme.palette.rfWhite,
  borderRadius: '21px',
}))

export const StyledStatusFound = styled(StyledStatus)(({ theme }) => ({
  backgroundColor: theme.palette.rfSuccess,
}))

export const StyledStatusNotFound = styled(StyledStatus)(({ theme }) => ({
  backgroundColor: theme.palette.rfBrandSecondary,
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3.5, 4),
  maxWidth: '764px',
  justifyContent: 'flex-start',
  gap: theme.spacing(4),
  flexDirection: 'row',
  boxSizing: 'border-box',
  border: `1px solid ${theme.palette.rfLinesLight}`,
  backgroundColor: theme.palette.rfBackground,
  alignItems: 'center',
}))

export const StyledName = styled(Typography)(({ theme }) => ({
  width: '100%',
  maxWidth: '585px',
  ...theme.typography.bodySmall,
  color: theme.palette.rfText,
}))
