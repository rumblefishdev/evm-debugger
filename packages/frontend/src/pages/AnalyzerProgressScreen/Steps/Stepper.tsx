import { AnalyzerStagesStatus } from '../../../store/analyzer/analyzer.const'

import { DefaultStep } from './DefaultStep'
import { ErrorStep } from './ErrorStep'
import { StyledStepper } from './styles'
import type { AnalyzerStepperProps } from './types'

export const Stepper = ({ stages, error, ...props }: AnalyzerStepperProps) => {
  const currentIndex = stages.findIndex((stage) => stage.stageStatus === AnalyzerStagesStatus.IN_PROGRESS)
  const activeStep = currentIndex === -1 ? stages.length : currentIndex

  console.log('stages', stages)
  console.log('error', error)
  console.log('currentIndex', currentIndex)
  console.log('activeStep', activeStep)

  return (
    <StyledStepper
      orientation="vertical"
      activeStep={activeStep}
      {...props}
    >
      {stages.map((stage, index) => {
        if (error && currentIndex === index)
          return (
            <ErrorStep
              key={stage.stageName}
              stepName={stage.stageName}
              errorMessage={error}
            />
          )
        return (
          <DefaultStep
            key={stage.stageName}
            stepName={stage.stageName}
          />
        )
      })}
    </StyledStepper>
  )
}
