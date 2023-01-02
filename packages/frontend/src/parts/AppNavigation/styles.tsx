import { Tabs, styled, Stack, Tab } from '@mui/material'

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',
  height: '48px',
  backgroundColor: theme.palette.rfBackground,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.rfButton,
  },
}))
export const StyledTab = styled(Tab)(({ theme }) => ({
  ...theme.typography.buttonSmall,
  margin: theme.spacing(0, 6),
  color: theme.palette.rfText,

  '&.Mui-selected': {
    color: theme.palette.rfButton,
  },
}))
