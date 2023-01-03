import { Stack, Stepper, styled, Typography } from '@mui/material'

export const StyledMainPanel = styled(Stack)(() => ({
  width: '524px',
  position: 'relative',
}))

export const StyledMainPanelWrapper = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
  flexDirection: 'column',
}))

export const StyledHeadline = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfText,
}))
export const StyledHeadlineCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfBrandSecondary,
}))

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  width: '364px',
  marginTop: theme.spacing(7),
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

export const StyledImageWrapper = styled('div')(() => ({
  width: '100%',
  height: '445px',
}))

export const StyledImage = styled('img')(() => ({
  zIndex: -1,
  width: 'auto',
  top: '-220px',
  position: 'relative',
  left: '128px',
  height: '756px',
}))

export const StyledLogPanel = styled(Stack)(({ theme }) => ({
  width: '1003px',
  padding: theme.spacing(6),
  height: '100%',
  boxSizing: 'border-box',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.rfLinesLight}`,
  backgroundColor: 'rgba(245, 246, 248, 0.9)',
  backdropFilter: 'blur(8px)',
}))

export const StyledLogContiner = styled(Stack)(({ theme }) => ({
  overflow: 'auto',
  marginTop: theme.spacing(8),
  gap: theme.spacing(4),
  ...theme.customStyles.scrollbar,
}))

export const StyledLogRecord = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  flexDirection: 'row',
}))
export const StyledMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfSecondary,
}))
export const StyledTimestamp = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rajdhani',
  color: theme.palette.rfDisabledDark,
}))
