import { Stack, Step, Stepper, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'space-around',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledStepper = styled(Stepper)(() => ({
  width: '100%',
  minHeight: '96px',
  maxWidth: '1280px',
}))

export const StyledStep = styled(Step)(() => ({
  maxWidth: '264px',
}))

export const StyledMessegesFrame = styled(Stack)(() => ({
  width: '100%',
  overflow: 'auto',
  maxWidth: '1280px',
  maxHeight: '720px',
  height: '100%',
  flexDirection: 'column',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.23)',
}))

export const StyledMessageBox = styled(Stack)(() => ({
  width: '100%',
  padding: '8px 24px',
  justifyContent: 'flex-start',
  flexDirection: 'row',
}))

export const StyledMessage = styled(Typography)(() => ({
  fontSize: '16px',
  fontFamily: 'monospace',
}))

export const StyledTimeStamp = styled(Typography)(() => ({
  marginRight: '8px',
  fontSize: '16px',
  fontFamily: 'monospace',
  color: 'rgba(0, 0, 0, 0.54)',
}))

export const StyledButtonsWrapper = styled(Stack)(() => ({
  width: '256px',
  justifyContent: 'space-between',
  height: '64px',
  flexDirection: 'row',
  alignItems: 'flex-start',
}))
