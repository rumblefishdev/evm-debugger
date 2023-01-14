import type { StepperProps, StepProps } from '@mui/material'

import type { TAnalyzeStage } from '../../../store/analyzer/analyzer.types'

export interface AnalyzerStepProps extends StepProps {
  stepName: string
  errorMessage?: string
}

export interface AnalyzerStepperProps extends StepperProps {
  stages: TAnalyzeStage[]
  error: string
}
