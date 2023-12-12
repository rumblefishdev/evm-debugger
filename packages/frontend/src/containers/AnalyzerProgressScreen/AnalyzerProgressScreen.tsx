import { Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { ChainId } from '@evm-debuger/types'

import { Button } from '../../importedComponents/components/Button'
import { analyzerActions } from '../../store/analyzer/analyzer.slice'
import { useTypedDispatch } from '../../store/storeHooks'
import { ROUTES } from '../../routes'
import { Section } from '../../importedComponents/components/Section'
import { analyzerSelectors } from '../../store/analyzer/analyzer.selectors'
import { uiSelectors } from '../../store/ui/ui.selectors'
import { uiActions } from '../../store/ui/ui.slice'

import { StyledContainer, StyledHeadlineCaption, StyledStack } from './AnalyzerProgressScreen.styles'
import { Stepper } from './Steps'
import { Logger } from './Logger/Logger'

export const AnalyzerProgressScreen = () => {
  const navigate = useNavigate()
  const dispatch = useTypedDispatch()
  const { chainId, txHash } = useParams()

  const stages = useSelector(analyzerSelectors.selectAllStages)
  const shouldShowAnalyzerProgressScreen = useSelector(uiSelectors.selectShouldShowProgressScreen)
  const hasProcessingFailed = useSelector(analyzerSelectors.selectHasProcessingFailed)
  const messages = useSelector(analyzerSelectors.selectAllMessages)

  const isRunOnce = React.useRef(shouldShowAnalyzerProgressScreen)

  useEffect(() => {
    if (chainId && txHash && !isRunOnce.current) {
      dispatch(analyzerActions.processTransaction({ transactionHash: txHash, chainId: chainId as unknown as ChainId }))
      isRunOnce.current = true
    }
  }, [dispatch, txHash, chainId, stages, isRunOnce])

  const moveBackToStartingScreen = useCallback(() => {
    dispatch(analyzerActions.resetAnalyzer())
    isRunOnce.current = false
    navigate(ROUTES.HOME)
  }, [navigate, dispatch])

  const restartHandler = useCallback(() => {
    dispatch(analyzerActions.resetAnalyzer())
    isRunOnce.current = false
  }, [dispatch])

  const closeAnalyzerProgressScreen = useCallback(() => {
    dispatch(uiActions.setShouldShowProgressScreen(false))
  }, [dispatch])

  const shouldShowButtons = hasProcessingFailed || shouldShowAnalyzerProgressScreen

  return (
    <Section
      mobilePadding={false}
      height="fullHeight"
      width="full"
      backgroundColor="transparent"
    >
      <StyledStack>
        <StyledContainer>
          <Stack>
            <StyledHeadlineCaption
              variant="uppercase"
              gutterBottom={true}
            >
              EVM Debugger
            </StyledHeadlineCaption>
            <Typography variant="heading4">Fetching progress</Typography>
          </Stack>
          <Stepper stages={stages} />
          {shouldShowButtons && (
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
                onClick={shouldShowAnalyzerProgressScreen ? closeAnalyzerProgressScreen : moveBackToStartingScreen}
              >
                {shouldShowAnalyzerProgressScreen ? 'Close' : 'Back'}
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
        </StyledContainer>
        <Logger messages={messages} />
      </StyledStack>
    </Section>
  )
}
