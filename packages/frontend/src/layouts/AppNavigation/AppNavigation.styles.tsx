import { Tabs, styled, Tab, Stack } from '@mui/material'

import { NewTransactionButton } from '../../containers/NewTransactionButton'

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',
  minHeight: '48px',

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

export const StyledButtonWrapper = styled(Stack)(({ theme }) => ({
  minWidth: '900px',

  justifyContent: 'space-between',
  flexDirection: 'row',
  borderBottom: `1px solid ${theme.palette.divider}`,
  alignItems: 'center',
}))

export const StyledNewTransactionButton = styled(NewTransactionButton)({
  whiteSpace: 'nowrap',
})
