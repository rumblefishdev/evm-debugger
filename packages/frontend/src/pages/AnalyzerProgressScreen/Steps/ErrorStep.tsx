import { Step, StepLabel, Typography, useTheme } from '@mui/material'

import { Error } from '../../../icons'

import type { AnalyzerStepProps } from './types'

export const ErrorStep = ({ errorMessage, stepName, ...props }: AnalyzerStepProps) => {
  const theme = useTheme()

  const stepLabelProps = {
    optional: (
      <Typography
        variant="caption"
        color={theme.palette.rfBrandSecondary}
      >
        {errorMessage}
      </Typography>
    ),
  }

  return (
    <Step
      {...props}
      key={stepName}
    >
      <StepLabel
        icon={<Error />}
        error
        {...stepLabelProps}
      >
        {stepName}
      </StepLabel>
    </Step>
  )
}
