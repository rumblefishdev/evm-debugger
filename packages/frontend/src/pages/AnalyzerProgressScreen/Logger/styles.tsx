import { Stack, styled, Typography } from '@mui/material'

import { LogMessageStatus } from '../../../store/analyzer/analyzer.const'

export const StyledLogPanel = styled(Stack)(({ theme }) => ({
  width: '70%',
  padding: theme.spacing(6),
  overflowY: 'auto',
  height: '100%',
  boxSizing: 'border-box',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.rfLinesLight}`,
  backgroundColor: 'rgba(245, 246, 248, 0.9)',
  backdropFilter: 'blur(8px)',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(2),
  },
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfText,
  ...theme.typography.headingUnknown,
}))

export const StyledLogContiner = styled(Stack)(({ theme }) => ({
  rowGap: theme.spacing(2),
  marginTop: theme.spacing(4),
  gridTemplateColumns: 'auto 1fr',
  display: 'grid',
  columnGap: theme.spacing(2),
  ...theme.customStyles.scrollbar,
}))

export const StyledMessage = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: LogMessageStatus }>(({ theme, status }) => ({
  ...(status === LogMessageStatus.ERROR && {
    color: theme.palette.rfBrandSecondary,
  }),
  ...(status === LogMessageStatus.INFO && {
    color: theme.palette.rfSecondary,
  }),
  ...(status === LogMessageStatus.SUCCESS && {
    color: theme.palette.rfSuccess,
  }),
  ...(status === LogMessageStatus.WARNING && {
    color: theme.palette.rfSecondary,
  }),
}))
export const StyledTimestamp = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rajdhani',
  color: theme.palette.rfDisabledDark,
}))
