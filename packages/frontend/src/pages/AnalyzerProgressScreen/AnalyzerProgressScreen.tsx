import { Stack, Typography, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../importedComponents/components/Button'
import { etherscanUrls } from '../../config'
import { EtherscanSourceFetcher, StaticStructLogProvider, StaticTxInfoProvider } from '../../store/analyzer/analyzer.providers'
import { analyzerActions } from '../../store/analyzer/analyzer.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { ROUTES } from '../../routes'
import { supportedChains } from '../../helpers/chains'
import { Section } from '../../importedComponents/components/Section'

import { StyledHeadlineCaption, StyledStack } from './styles'
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

  const theme = useTheme()
  return (
    <>
      {(isLoading || error) && (
        <Section
          mobilePadding={false}
          height="fullHeight"
          width="full"
          backgroundColor="transparent"
        >
          <StyledStack>
            <Stack
              sx={{
                width: '30%',
                [theme.breakpoints.down('md')]: {
                  width: '100%',
                },
                gap: '20px',
                flexDirection: 'column',
                display: 'flex',
              }}
            >
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
              {error && (
                <Stack
                  justifyContent={'center'}
                  alignItems={'center'}
                  width={'100%'}
                  direction="row"
                  spacing={2}
                >
                  <Button
                    variant="outlined"
                    sx={{ width: '45%', backgroundColor: 'white' }}
                    onClick={moveBackToStartingScreen}
                  >
                    Back
                  </Button>

                  <Button
                    variant="contained"
                    sx={{ width: '45%', backgroundColor: 'white' }}
                    onClick={restartHandler}
                  >
                    Restart
                  </Button>
                </Stack>
              )}
            </Stack>

            <Logger messages={messages} />
          </StyledStack>
        </Section>
      )}
      {isStagesFinished && children}
    </>
  )
}
