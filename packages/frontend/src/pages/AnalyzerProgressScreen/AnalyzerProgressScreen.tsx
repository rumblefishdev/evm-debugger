import { Button, Stack, StepLabel, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { typedNavigate } from '../../router'
import { useTypedSelector } from '../../store/storeHooks'

import type {
  AnalyzerProgressScreenProps,
  AnalyzerStepProps,
} from './AnalyzerProgressScreen.types'
import {
  StyledButtonsWrapper,
  StyledMessage,
  StyledMessageBox,
  StyledMessegesFrame,
  StyledStack,
  StyledStep,
  StyledStepper,
  StyledTimeStamp,
} from './styles'

const DefaultStep = ({ stepName, ...props }: AnalyzerStepProps) => {
  return (
    <StyledStep {...props} key={stepName}>
      <StepLabel>{stepName}</StepLabel>
    </StyledStep>
  )
}

const ErrorStep = ({ errorMessage, stepName, ...props }: AnalyzerStepProps) => {
  const stepLabelProps = {
    optional: <Typography variant="caption">{errorMessage}</Typography>,
  }

  return (
    <StyledStep {...props} key={stepName}>
      <StepLabel error {...stepLabelProps}>
        {stepName}
      </StepLabel>
    </StyledStep>
  )
}

export const AnalyzerProgressScreen = ({
  ...props
}: AnalyzerProgressScreenProps) => {
  const navigate = useNavigate()

  const { messages, isLoading, error, stages } = useTypedSelector(
    (state) => state.analyzer,
  )

  // if (!isLoading && !error) typedNavigate(navigate, '/transactionScreen')

  const currentIndex = stages.findIndex((stage) => stage.isFinished === false)
  const activeStep = currentIndex === -1 ? stages.length : currentIndex

  return (
    <StyledStack {...props}>
      <StyledStepper activeStep={activeStep}>
        {stages.map((stage, index) => {
          if (error && currentIndex === index)
            return <ErrorStep stepName={stage.stageName} errorMessage={error} />
          return <DefaultStep stepName={stage.stageName} />
        })}
      </StyledStepper>

      <StyledMessegesFrame>
        {messages.map((message) => {
          return (
            <StyledMessageBox>
              <StyledTimeStamp>
                {message.timestamp.toLocaleTimeString()}:
              </StyledTimeStamp>
              <StyledMessage>{message.message}</StyledMessage>
            </StyledMessageBox>
          )
        })}
      </StyledMessegesFrame>
      <StyledButtonsWrapper flexDirection="row">
        {error ? (
          <>
            <Button variant="contained">Back</Button>
            <Button variant="outlined">Try again</Button>
          </>
        ) : null}
      </StyledButtonsWrapper>
    </StyledStack>
  )
}
