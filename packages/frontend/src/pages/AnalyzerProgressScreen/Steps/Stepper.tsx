import { AnalyzerStagesStatus } from '../../../store/analyzer/analyzer.const'

import { DefaultStep } from './DefaultStep'
import { ErrorStep } from './ErrorStep'
import { StyledStepper } from './styles'
import type { AnalyzerStepperProps } from './types'

export const Stepper = ({ stages, ...props }: AnalyzerStepperProps) => {
  const currentIndex = stages.findIndex(
    (stage) => stage.stageStatus === AnalyzerStagesStatus.IN_PROGRESS || stage.stageStatus === AnalyzerStagesStatus.FAILED,
  )
  const activeStep = currentIndex === -1 ? stages.length : currentIndex

  return (
    <StyledStepper
      orientation="vertical"
      activeStep={activeStep}
      {...props}
    >
      {stages.map((stage) => {
        if (stage.stageStatus === AnalyzerStagesStatus.FAILED)
          return (
            <ErrorStep
              key={stage.stageName}
              stepName={stage.stageName}
            />
          )
        return (
          <DefaultStep
            key={stage.stageName}
            stepName={stage.stageName}
            completed={stage.stageStatus === AnalyzerStagesStatus.SUCCESS}
          />
        )
      })}
    </StyledStepper>
  )
}
