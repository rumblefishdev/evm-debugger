import { Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/Button'
import { TailProgressScreen } from '../../images'
import { etherscanKey, etherscanUrl } from '../../config'
import {
  EtherscanSourceFetcher,
  StaticStructLogProvider,
  StaticTxInfoProvider,
} from '../../store/analyzer/analyzer.providers'
import { analyzerActions } from '../../store/analyzer/analyzer.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { ROUTES } from '../../router'
import { AppContainer } from '../../components/AppContainer'
import { supportedChains } from '../../helpers/chains'

import { StyledHeadlineCaption, StyledImage, StyledMainPanel } from './styles'
import { Stepper } from './Steps'
import { Logger } from './Logger/Logger'

export const AnalyzerProgressScreen = ({ children = null }) => {
  const navigate = useNavigate()
  const dispatch = useTypedDispatch()
  const { chainId, txHash } = useParams()
  const { messages, isLoading, error, stages } = useTypedSelector(
    (state) => state.analyzer,
  )

  const txInfo = useTypedSelector((state) => state.rawTxData.transactionInfo)
  const structLogs = useTypedSelector((state) => state.structLogs.structLogs)

  useEffect(() => {
    if (chainId && txHash && !stages.every((stage) => stage.isFinished)) {
      const chainData = supportedChains[chainId]
      dispatch(
        analyzerActions.runAnalyzer({
          txInfoProvider: chainData.txInfoProvider(txHash),
          structLogProvider: chainData.structLogProvider(txHash),
          sourceProvider: chainData.sourceProvider,
          bytecodeProvider: chainData.bytecodeProvider,
        }),
      )
    }
  }, [dispatch, txHash, chainId, stages])

  useEffect(() => {
    if (!isLoading && !error) {
      const timeout = setTimeout(() => {
        if (!(chainId && txHash)) navigate(ROUTES.TRANSACTION_SCREEN_MANUAL)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, error, navigate, chainId, txHash])

  const moveBackToStartingScreen = useCallback(() => {
    navigate(ROUTES.HOME)
  }, [navigate])

  const restartHandler = useCallback(() => {
    if (error)
      dispatch(
        analyzerActions.runAnalyzer({
          txInfoProvider: new StaticTxInfoProvider(txInfo),
          structLogProvider: new StaticStructLogProvider(structLogs),
          sourceProvider: new EtherscanSourceFetcher(
            etherscanUrl,
            etherscanKey,
          ),
        }),
      )
  }, [dispatch, error, structLogs, txInfo])

  const buttonsStyle: React.CSSProperties = {
    width: '224px',
  }

  return (
    <>
      {(isLoading || error) && (
        <>
          <AppContainer>
            <StyledMainPanel>
              <Stack>
                <Stack>
                  <StyledHeadlineCaption
                    variant="uppercase"
                    gutterBottom={true}
                  >
                    EVM Debugger
                  </StyledHeadlineCaption>
                  <Typography variant="heading4">Fetching progress</Typography>
                </Stack>
                <Stepper stages={stages} error={error} />
              </Stack>
              <StyledImage src={TailProgressScreen} />
              {error && (
                <Stack direction="row" spacing={2}>
                  <Button
                    style={buttonsStyle}
                    variant="outlined"
                    onClick={moveBackToStartingScreen}
                  >
                    Back
                  </Button>
                  <Button
                    style={buttonsStyle}
                    variant="contained"
                    onClick={restartHandler}
                  >
                    Restart
                  </Button>
                </Stack>
              )}
            </StyledMainPanel>
            <Logger messages={messages} />
          </AppContainer>
        </>
      )}
      {stages.every((stage) => stage.isFinished) && children}
    </>
  )
}
