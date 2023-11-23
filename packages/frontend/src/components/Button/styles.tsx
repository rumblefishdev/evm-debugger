import { Button, styled } from '@mui/material'

export const StyledButton = styled(Button)(({ theme }) => ({
  '.MuiButton-text': {
    fontWeight: 600,
    fontSize: '14px',
    fontFamily: 'Rajdhani',
    color: theme.palette.rfButton,
    backgroundColor: 'unset',
  },

  '.MuiButton-root': {
    outline: 'none',
    cursor: 'pointer',
    border: 'none',
  },

  '.MuiButton-outlined': {
    color: theme.palette.rfButton,
    borderRadius: '32px',
    border: `1px solid ${theme.palette.rfLines}`,
    backgroundColor: 'unset',
  },
  '.MuiButton-contained': {
    color: theme.palette.rfWhite,
    borderRadius: '32px',
    backgroundColor: theme.palette.rfButton,

    '.Mui-disabled': {
      color: theme.palette.rfDisabled,
      backgroundColor: theme.palette.rfLinesLight,
    },
  },
  '&.MuiButton-sizeSmall': {
    padding: theme.spacing(1, 2),
    ...theme.typography.buttonSmall,
  },

  '&.MuiButton-sizeMedium': {
    padding: theme.spacing(2, 4),
    ...theme.typography.buttonMedium,
  },

  '&.MuiButton-sizeLarge': {
    padding: theme.spacing(3, 6),
    ...theme.typography.buttonBig,
  },
}))
