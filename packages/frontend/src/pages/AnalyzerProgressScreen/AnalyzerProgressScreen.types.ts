import type { StackProps, StepProps } from '@mui/material'

export interface AnalyzerProgressScreenProps extends StackProps {}
export interface AnalyzerStepProps extends StepProps {
  stepName: string
  errorMessage?: string
}
