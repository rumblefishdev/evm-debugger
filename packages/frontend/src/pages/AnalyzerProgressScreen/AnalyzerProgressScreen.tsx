import { Stack, Step, StepLabel, Typography, useTheme } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import { Error, TickFilledBlue } from '../../icons'
import { TailProgressScreen } from '../../images'
import { etherscanKey, etherscanUrl } from '../../config'
import { EtherscanAbiFetcher, StaticStructLogProvider, StaticTxInfoProvider } from '../../store/analyzer/analyzer.providers'
import { analyzerActions } from '../../store/analyzer/analyzer.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { ROUTES } from '../../router'
import { AppContainer } from '../../components/AppContainer'

import type { AnalyzerProgressScreenProps, AnalyzerStepProps } from './AnalyzerProgressScreen.types'
import {
  StyledHeadlineCaption,
  StyledImage,
  StyledImageWrapper,
  StyledLogContiner,
  StyledLogPanel,
  StyledLogRecord,
  StyledMainPanel,
  StyledMainPanelWrapper,
  StyledMessage,
  StyledStepper,
  StyledTimestamp,
} from './styles'

const DefaultStep = ({ stepName, completed, ...props }: AnalyzerStepProps) => {
  return (
    <Step {...props} key={stepName}>
      <StepLabel icon={completed ? <TickFilledBlue /> : null}>{stepName}</StepLabel>
    </Step>
  )
}

const ErrorStep = ({ errorMessage, stepName, ...props }: AnalyzerStepProps) => {
  const theme = useTheme()

  const stepLabelProps = {
    optional: (
      <Typography variant="caption" color={theme.palette.rfBrandSecondary}>
        {errorMessage}
      </Typography>
    ),
  }

  return (
    <Step {...props} key={stepName}>
      <StepLabel icon={<Error />} error {...stepLabelProps}>
        {stepName}
      </StepLabel>
    </Step>
  )
}

export const AnalyzerProgressScreen = ({ ...props }: AnalyzerProgressScreenProps) => {
  const navigate = useNavigate()
  const dispatch = useTypedDispatch()
  const theme = useTheme()

  const scrollRef = React.useRef<HTMLDivElement>(null)

  const { messages, isLoading, error, stages } = useTypedSelector((state) => state.analyzer)

  const txInfo = useTypedSelector((state) => state.rawTxData.transactionInfo)
  const structLogs = useTypedSelector((state) => state.structLogs.structLogs)

  useEffect(() => {
    if (!isLoading && !error) {
      const timeout = setTimeout(() => navigate(ROUTES.TRANSACTION_SCREEN), 1000)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, error, navigate])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const currentIndex = stages.findIndex((stage) => stage.isFinished === false)
  const activeStep = currentIndex === -1 ? stages.length : currentIndex

  const moveBackToStartingScreen = useCallback(() => {
    navigate(ROUTES.HOME)
  }, [navigate])

  const restartHandler = useCallback(() => {
    if (error && !isLoading)
      dispatch(
        analyzerActions.runAnalyzer({
          txInfoProvider: new StaticTxInfoProvider(txInfo),
          structLogProvider: new StaticStructLogProvider(structLogs),
          abiProvider: new EtherscanAbiFetcher(etherscanUrl, etherscanKey),
        })
      )
  }, [dispatch, isLoading, error, structLogs, txInfo])

  return (
    <AppContainer>
      <StyledMainPanel>
        <StyledMainPanelWrapper>
          <Stack>
            <StyledHeadlineCaption variant="uppercase" gutterBottom={true}>
              EVM Debugger
            </StyledHeadlineCaption>
            <Typography variant="heading4">Fetching progress</Typography>
          </Stack>
          <StyledStepper orientation="vertical" activeStep={activeStep}>
            {stages.map((stage, index) => {
              if (error && currentIndex === index)
                return <ErrorStep key={stage.stageName} stepName={stage.stageName} errorMessage={error} />
              return <DefaultStep key={stage.stageName} stepName={stage.stageName} />
            })}
          </StyledStepper>
          <StyledImageWrapper>
            <StyledImage src={TailProgressScreen} />
          </StyledImageWrapper>
          <Stack direction="row" spacing={2}>
            <Button style={{ width: '224px' }} variant="outlined" onClick={moveBackToStartingScreen}>
              Back
            </Button>
            <Button style={{ width: '224px' }} variant="contained" onClick={restartHandler}>
              Restart
            </Button>
          </Stack>
        </StyledMainPanelWrapper>
      </StyledMainPanel>
      <StyledLogPanel>
        <Typography variant="headingUnknown">Console info</Typography>
        <StyledLogContiner ref={scrollRef}>
          {messages.map((item, index) => {
            const { message, timestamp } = item
            const isError = message.includes('Error')

            return (
              <StyledLogRecord key={index}>
                <StyledTimestamp>{timestamp.toLocaleTimeString()}:</StyledTimestamp>
                <StyledMessage sx={isError ? { color: theme.palette.rfBrandSecondary } : {}} variant="inputText">
                  {message}
                </StyledMessage>
              </StyledLogRecord>
            )
          })}
        </StyledLogContiner>
      </StyledLogPanel>
    </AppContainer>
  )
}
