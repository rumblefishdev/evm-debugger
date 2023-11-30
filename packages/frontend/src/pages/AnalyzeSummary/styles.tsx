import { Stack, styled, Tab, Tabs } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(4),
  justifyContent: 'flex-start',
  height: '100%',
  flexDirection: 'column',
  boxShadow: '0px 0px 8px 0px rgba(0, 10, 108, 0.2)',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
  alignItems: 'center',
}))

export const StyledContentWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  overflow: 'hidden',
  maxHeight: '100%',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  boxSizing: 'border-box',
  alignItems: 'center',
}))

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2, 0),
  backgroundColor: '#eceef0',

  // MuiTabs-indicator
  '& .MuiTabs-indicator': {
    zIndex: 20,
    top: 2,
    height: '90%',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '99px',
    backgroundColor: theme.palette.rfWhite,
  },
}))
export const StyledTab = styled(Tab)(({ theme }) => ({
  padding: theme.spacing(2.5, 9),
  margin: theme.spacing(0, 2),
  ...theme.typography.label,
  zIndex: 30,
  minWidth: '128px',
  fontWeight: 550,
  borderRadius: '37px',
  // selected
  '&.Mui-selected': {
    color: theme.palette.text.primary,
  },
}))
