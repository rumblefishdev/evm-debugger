import { Stack, Typography, styled } from '@mui/material'

export const StyledFunctionStackTraceContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2, 0),
  overflowY: 'hidden',
  marginTop: theme.spacing(5),
  height: '100%',
  boxSizing: 'border-box',
  backgroundColor: 'white',
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  zIndex: 100,
  width: '100%',
  position: 'fixed',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexDirection: 'row',
  boxSizing: 'border-box',
  backgroundColor: 'white',
  alignItems: 'center',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  color: theme.palette.rfSecondary,
}))

export const StyledButtonsWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  flexDirection: 'row',
  boxSizing: 'border-box',
  alignItems: 'center',
}))

export const StyledListWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflowY: 'scroll',
  marginTop: theme.spacing(8),
  height: '100%',
  ...theme.customStyles.scrollbar,
  padding: theme.spacing(2),
  gap: theme.spacing(0.5),

  boxSizing: 'border-box',

  '&:first-child': {
    borderTop: '1px solid #e6aca8',
  },
}))
