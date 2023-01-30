import { Tabs, styled, Tab } from '@mui/material'

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',
  height: '64px',
  backgroundColor: theme.palette.rfBackground,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.rfButton,
  },
}))
export const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: '168px',
  height: '64px',
  ...theme.typography.buttonSmall,
  margin: theme.spacing(0, 6),
  color: theme.palette.rfText,

  '&.Mui-selected': {
    color: theme.palette.rfButton,
  },
}))
