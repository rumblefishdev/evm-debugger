import { Stack, styled, Typography } from '@mui/material'

export const StyledLogPanel = styled(Stack)(({ theme }) => ({
  width: '1003px',
  padding: theme.spacing(6),
  height: '100%',
  boxSizing: 'border-box',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.rfLinesLight}`,
  backgroundColor: 'rgba(245, 246, 248, 0.9)',
  backdropFilter: 'blur(8px)',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfText,
  ...theme.typography.headingUnknown,
}))

export const StyledLogContiner = styled(Stack)(({ theme }) => ({
  overflow: 'auto',
  marginTop: theme.spacing(8),
  gap: theme.spacing(4),
  ...theme.customStyles.scrollbar,
}))

export const StyledLogRecord = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  flexDirection: 'row',
}))
export const StyledMessage = styled(Typography, { shouldForwardProp: (prop) => prop !== 'isError' })<{ isError: boolean }>(
  ({ theme, isError }) => ({
    color: isError ? theme.palette.rfBrandSecondary : theme.palette.rfSecondary,
  })
)
export const StyledTimestamp = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rajdhani',
  color: theme.palette.rfDisabledDark,
}))