import { Tabs, styled, Tab, Stack } from '@mui/material'

import { NewTransactionButton } from '../../containers/NewTransactionButton'
import { Button } from '../../components/Button'

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',

  height: '48px',
  backgroundColor: theme.palette.rfBackground,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.rfButton,
  },
}))
export const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: '168px',
  ...theme.typography.buttonSmall,
  margin: theme.spacing(0, 6),
  color: theme.palette.rfText,

  '&.Mui-selected': {
    color: theme.palette.rfButton,
  },
}))

export const StyledButtonWrapper = styled(Stack)({
  width: '100%',
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'center',
})

export const StyledNewTransactionButton = styled(NewTransactionButton)({
  zIndex: 10,
  whiteSpace: 'nowrap',
  position: 'absolute',
  left: 10,
})

export const StyledShowLogsButton = styled(Button)(({ theme }) => ({
  zIndex: 10,
  whiteSpace: 'nowrap',
  right: 0,
  position: 'absolute',
}))
