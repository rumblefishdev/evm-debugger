import { Button, StepLabel, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { etherscanKey, etherscanUrl } from '../../config'
import { typedNavigate } from '../../router'
import {
  EtherscanAbiFetcher,
  StaticStructLogProvider,
  StaticTxInfoProvider,
} from '../../store/analyzer/analyzer.providers'
import { analyzerActions } from '../../store/analyzer/analyzer.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'

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
  const dispatch = useTypedDispatch()

  const { messages, isLoading, error, stages } = useTypedSelector(
    (state) => state.analyzer,
  )

  const txInfo = useTypedSelector((state) => state.rawTxData.transactionInfo)
  const structLogs = useTypedSelector((state) => state.structLogs.structLogs)

  useEffect(() => {
    if (!isLoading && !error) {
      const timeout = setTimeout(
        () => typedNavigate(navigate, '/transactionScreen'),
        1000,
      )
      return () => clearTimeout(timeout)
    }
  }, [isLoading, error, navigate])

  const currentIndex = stages.findIndex((stage) => stage.isFinished === false)
  const activeStep = currentIndex === -1 ? stages.length : currentIndex

  const moveBackToStartingScreen = useCallback(() => {
    typedNavigate(navigate, '/')
  }, [navigate])

  const restartHandler = useCallback(() => {
    if (error && !isLoading)
      dispatch(
        analyzerActions.runAnalyzer({
          txInfoProvider: new StaticTxInfoProvider(txInfo),
          structLogProvider: new StaticStructLogProvider(structLogs),
          abiProvider: new EtherscanAbiFetcher(etherscanUrl, etherscanKey),
        }),
      )
  }, [dispatch, isLoading, error, structLogs, txInfo])

  return (
    <StyledStack {...props}>
      <StyledStepper activeStep={activeStep}>
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
            <DefaultStep key={stage.stageName} stepName={stage.stageName} />
          )
        })}
      </StyledStepper>

      <StyledMessegesFrame>
        {messages.map((message, index) => {
          return (
            <StyledMessageBox key={index}>
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
            <Button variant="contained" onClick={moveBackToStartingScreen}>
              Back
            </Button>
            <Button variant="outlined" onClick={restartHandler}>
              Try again
            </Button>
          </>
        ) : null}
      </StyledButtonsWrapper>
    </StyledStack>
  )
}
