import { Stack, Typography, styled } from '@mui/material'

export const StyledBar = styled(Stack)(({ theme }) => ({
  zIndex: 10,
  width: '100%',
  transition: 'all 0.3s ease',
  position: 'fixed',
  padding: theme.spacing(2),
  left: 0,
  justifyContent: 'center',
  height: 32,
  cursor: 'pointer',
  boxSizing: 'border-box',
  bottom: 0,

  borderTop: `1px solid #eeeeee`,

  backgroundColor: theme.palette.rfWhite,
  alignItems: 'center',

  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}))

export const StyledBarText = styled(Typography)(({ theme }) => ({
  ...theme.typography.buttonBig,
  color: theme.palette.rfButton,
}))

export const StyledTraceLogsListContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  boxSizing: 'border-box',
  backgroundColor: 'white',
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(3),
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
  overflowY: 'auto',
  overflowX: 'auto',
  height: '100%',
  ...theme.customStyles.scrollbar,
  gap: theme.spacing(0.5),
}))
