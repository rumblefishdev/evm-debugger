import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import { Box, Stack } from '@mui/material'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { TraceLogsList } from '../../components/TraceLogsList'

import { BytecodePanel, SourceCodePanel, StructlogPanel } from './Panels'
import { MemoryPanel } from './Panels/MemoryPanel/MemoryPanel'
import { StackPanel } from './Panels/StackPanel/StackPanel'
import { NavigationPanel } from './Panels/NavigationPanel/NavigationPanel'
import { StyledContentWrapper } from './TransactionExplorer.styles'

export const TransactionExplorer: React.FC = () => {
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  return (
    <StyledContentWrapper
      width="100%"
      minHeight="100%"
      justifyContent="flex-start"
      marginTop={8}
      spacing={1}
    >
      <Stack
        direction="row"
        width="100%"
        height={112}
        spacing={1}
      >
        <StackPanel />
        <MemoryPanel />
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
          <Stack flex={2}>
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
  )
}
