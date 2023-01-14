import { Tabs, Tab, Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '632px',
  padding: theme.spacing(12),
  marginTop: theme.spacing(32),
  borderRadius: '16px',
  borderBox: 'border-box',
  border: `1px solid ${theme.palette.rfLinesLight}`,
}))

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',
  paddingBottom: theme.spacing(12),
  minHeight: '48px',

  '& .MuiTabs-indicator': {
    height: '1px',
    backgroundColor: theme.palette.rfButton,
  },
}))
export const StyledTab = styled(Tab)(({ theme }) => ({
  ...theme.typography.buttonSmall,
  width: '50%',
  color: theme.palette.rfText,
  borderBox: 'border-box',
  borderBottom: `1px solid ${theme.palette.rfLines}`,
  '&.Mui-selected': {
    color: theme.palette.rfButton,
  },
}))
