import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(0),

  '&:last-of-type': {
    marginBottom: theme.spacing(0),
  },

  '&:first-of-type': {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(6),
  },
}))
export const StyledSectionHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  color: theme.palette.rfDisabledDark,
  ...theme.typography.headingUnknown,
}))

export const StyledFunctionsignature = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  lineHeight: '21px',
  letterSpacing: '-0.01em',
  fontWeight: 700,
  fontSize: '14px',
  fontFamily: 'Inter',
  color: theme.palette.rfSecondary,
}))

export const StyledContentWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
}))
