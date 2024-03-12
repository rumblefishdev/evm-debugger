import React from 'react'
import { useSelector } from 'react-redux'
import { Stack } from '@mui/material'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { TraceLogsListContainer } from '../../components/TraceLogsList'

import { BytecodePanel, SourceCodePanel, StructlogPanel, InformationPanel } from './Panels'
import { NavigationPanel } from './Panels/NavigationPanel/NavigationPanel'
import { StyledContentWrapper } from './TransactionExplorer.styles'

export const TransactionExplorer: React.FC = () => {
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  return (
    <>
      <StyledContentWrapper>
        <Stack
          direction="row"
          width="100%"
          minHeight={112}
          spacing={1}
        >
          <InformationPanel />
        </Stack>
        <Stack
          direction="row"
          width="100%"
          height="100%"
          minHeight={800}
          spacing={1}
        >
          <Stack
            width="60%"
            justifyContent="flex-start"
            spacing={1}
          >
            <Stack
              flex={2}
              maxHeight={280}
            >
              <NavigationPanel />
            </Stack>
            <Stack
              spacing={1}
              direction="row"
              height="100%"
              flex={3}
            >
              <StructlogPanel />
              <BytecodePanel />
            </Stack>
          </Stack>
          <Stack width="100%">
            <SourceCodePanel hasContract={activeBlock.isContract} />
          </Stack>
        </Stack>
      </StyledContentWrapper>
      <TraceLogsListContainer />
    </>
  )
}
