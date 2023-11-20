import { Stack, Typography, ThemeProvider } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { ChainId } from '@evm-debuger/types'

import { theme } from '../../theme/default'
import { Button } from '../../importedComponents/components/Button'
import { analyzerActions } from '../../store/analyzer/analyzer.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { ROUTES } from '../../routes'
import { Section } from '../../importedComponents/components/Section'
import { structlogsSelectors } from '../../store/structlogs/structlogs.selectors'
import { analyzerSelectors } from '../../store/analyzer/analyzer.selectors'

import { StyledHeadlineCaption, StyledStack } from './styles'
import { Stepper } from './Steps'
import { Logger } from './Logger/Logger'

// eslint-disable-next-line react/prop-types
export const AnalyzerProgressScreen = ({ children = null }) => {
  const navigate = useNavigate()
  const dispatch = useTypedDispatch()
  const { chainId, txHash } = useParams()
  const [isRunOnce, setIsRunOnce] = useState(false)

  const stages = useSelector(analyzerSelectors.selectAllStages)
  const isAnalyzerRunning = useSelector(analyzerSelectors.selectIsAnalyzerRunning)
  const isAnalyzerSuccessfullyFinished = useSelector(analyzerSelectors.selectIsAnalyzerSuccessfullyFinished)
  const criticalError = useSelector(analyzerSelectors.selectCriticalError)
  const messages = useSelector(analyzerSelectors.selectAllMessages)

  useEffect(() => {
    if (chainId && txHash && !isRunOnce) {
      setIsRunOnce(true)
      dispatch(analyzerActions.processTransaction({ transactionHash: txHash, chainId: chainId as unknown as ChainId }))
      // } else if (chainId && txHash && !isRunOnce) {
      //   setIsRunOnce(true)
      //   dispatch(
      //     analyzerActions.regenerateAnalyzer({
      //       txInfoProvider: chainData.txInfoProvider(txHash),
      //       structLogProvider: chainData.structLogProvider(txHash),
      //       sourceProvider: chainData.sourceProvider,
      //       bytecodeProvider: chainData.bytecodeProvider,
      //     }),
      //   )
    }
  }, [dispatch, txHash, chainId, stages, isRunOnce])

  useEffect(() => {
    if (!isAnalyzerRunning && !criticalError) {
      const timeout = setTimeout(() => {
        if (!(chainId && txHash)) navigate(ROUTES.TRANSACTION_SCREEN_MANUAL)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isAnalyzerRunning, criticalError, navigate, chainId, txHash])

  const moveBackToStartingScreen = useCallback(() => {
    navigate(ROUTES.HOME)
  }, [navigate])

  const restartHandler = useCallback(() => {
    if (criticalError) dispatch(analyzerActions.processTransaction({ transactionHash: txHash, chainId: chainId as unknown as ChainId }))
  }, [dispatch, criticalError, txHash, chainId])

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* {(isAnalyzerRunning || criticalError) && ( */}
        {true && (
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
                  error={criticalError}
                />
                {criticalError && (
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
                      sx={{ width: '45%' }}
                      onClick={restartHandler}
                    >
                      Restart
                    </Button>
                  </Stack>
                )}
              </Stack>

              <Logger messages={messages.map(({ timestamp, message }) => ({ timestamp: new Date(timestamp), message }))} />
            </StyledStack>
          </Section>
        )}
        {false && children}
      </ThemeProvider>
    </>
  )
}
