import { Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/Button'
import { TailProgressScreen } from '../../images'
import { etherscanUrls } from '../../config'
import { EtherscanSourceFetcher, StaticStructLogProvider, StaticTxInfoProvider } from '../../store/analyzer/analyzer.providers'
import { analyzerActions } from '../../store/analyzer/analyzer.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { ROUTES } from '../../routes'
import { AppContainer } from '../../components/AppContainer'
import { supportedChains } from '../../helpers/chains'

import { StyledHeadlineCaption, StyledImage, StyledMainPanel } from './styles'
import { Stepper } from './Steps'
import { Logger } from './Logger/Logger'

// eslint-disable-next-line react/prop-types
export const AnalyzerProgressScreen = ({ children = null }) => {
  const navigate = useNavigate()
  const dispatch = useTypedDispatch()
  const { chainId, txHash } = useParams()
  const [isRunOnce, setIsRunOnce] = useState(false)
  const { messages, isLoading, error, stages } = useTypedSelector((state) => state.analyzer)

  const txInfo = useTypedSelector((state) => state.rawTxData.transactionInfo)
  const structLogs = useTypedSelector((state) => state.structLogs.structLogs)

  const isStagesFinished = useMemo(() => {
    return stages.every((stage) => stage.isFinished)
  }, [stages])

  useEffect(() => {
    const chainData = supportedChains[chainId]
    if (chainId && txHash && !isStagesFinished) {
      if (!isRunOnce) {
        setIsRunOnce(true)
        dispatch(
          analyzerActions.runAnalyzer({
            txInfoProvider: chainData.txInfoProvider(txHash),
            structLogProvider: chainData.structLogProvider(txHash),
            sourceProvider: chainData.sourceProvider,
            bytecodeProvider: chainData.bytecodeProvider,
          }),
        )
      }
    } else if (chainId && txHash && !isRunOnce) {
      setIsRunOnce(true)
      dispatch(
        analyzerActions.regenerateAnalyzer({
          txInfoProvider: chainData.txInfoProvider(txHash),
          structLogProvider: chainData.structLogProvider(txHash),
          sourceProvider: chainData.sourceProvider,
          bytecodeProvider: chainData.bytecodeProvider,
        }),
      )
    }
  }, [dispatch, txHash, chainId, stages, isRunOnce, isStagesFinished])

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
          sourceProvider: new EtherscanSourceFetcher(etherscanUrls[txInfo.chainId].url, etherscanUrls[txInfo.chainId].key),
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
                <Stepper
                  stages={stages}
                  error={error}
                />
              </Stack>
              <StyledImage src={TailProgressScreen} />
              {error && (
                <Stack
                  direction="row"
                  spacing={2}
                >
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
            <Logger
              messages={messages}
              style={{ marginTop: 24 }}
            />
          </AppContainer>
        </>
      )}
      {isStagesFinished && children}
    </>
  )
}
