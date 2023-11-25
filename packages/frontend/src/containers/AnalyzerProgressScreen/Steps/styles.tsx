import { Stepper, styled } from '@mui/material'

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  width: '364px',
  marginTop: theme.spacing(3),
  // MuiStepLabel-label
  '& .MuiStepLabel-label': {
    color: theme.palette.rfDisabledDark,
    ...theme.typography.label,
    textTransform: 'uppercase',
  },

  '& .MuiStepConnector-lineVertical': {
    borderColor: theme.palette.rfLinesLight,
  },
  // MuiStepIcon-root
  '& .Mui-disabled': {
    color: theme.palette.rfDisabled,

    '& .MuiSvgIcon-root': {
      color: theme.palette.rfDisabled,
    },
  },
}))
