import { Stack, styled, Tab, Tabs } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'flex-start',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledContentWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(10),
  overflow: 'hidden',
  maxWidth: '764px',
  maxHeight: '100%',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  boxSizing: 'border-box',
  alignItems: 'center',
}))

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  zIndex: 10,
  padding: theme.spacing(1),
  // maxWidth: '484px',
  borderRadius: '99px',
  backgroundColor: theme.palette.rfLinesLight,

  // MuiTabs-indicator
  '& .MuiTabs-indicator': {
    zIndex: 20,
    top: 2,
    height: '95%',
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
  borderRadius: '37px',
  // selected
  '&.Mui-selected': {
    color: theme.palette.colorWhite,
  },
}))
