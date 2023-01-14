import { Step, StepLabel } from '@mui/material'

import { TickFilledBlue } from '../../../icons'

import type { AnalyzerStepProps } from './types'

export const DefaultStep = ({
  stepName,
  completed,
  ...props
}: AnalyzerStepProps) => {
  return (
    <Step {...props} key={stepName}>
      <StepLabel icon={completed ? <TickFilledBlue /> : null}>
        {stepName}
      </StepLabel>
    </Step>
  )
}
