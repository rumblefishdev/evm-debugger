import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { TraceLogsList } from '../../components/TraceLogsList'

import { BytecodePanel, SourceCodePanel, StructlogPanel } from './Panels'
import { MemoryPanel } from './Panels/MemoryPanel/MemoryPanel'
import { StackPanel } from './Panels/StackPanel/StackPanel'
import { QuickLinksPanel } from './Panels/QuickLinksPanel/QuickLinksPanel'

export const TransactionExplorerStaticGrid: React.FC = () => {
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  return (
    <Grid
      container
      spacing={2}
      alignItems={'start'}
      alignSelf={'start'}
    >
      <Grid
        id="left-panel" // trace, quicklinks, bytecode, structlog
        md={4}
        spacing={2}
        container
        item
        alignItems={'start'}
      >
        <Grid
          id="trace-panel"
          item
          md={12}
          style={{ height: '300px' }}
        >
          <TraceLogsList />
        </Grid>
        <Grid
          id="quicklinks-panel"
          item
          md={12}
          style={{ height: '300px' }}
        >
          <QuickLinksPanel />
        </Grid>
        <Grid
          id="structlog-panel"
          item
          md={6}
          style={{ height: '600px' }}
        >
          <StructlogPanel />
        </Grid>
        <Grid
          id="bytecode-panel"
          item
          md={6}
          style={{ height: '600px' }}
        >
          <BytecodePanel />
        </Grid>
      </Grid>

      <Grid
        id="right-panel" // src-code, memory, stack
        md={8}
        spacing={2}
        item
        container
        alignItems={'start'}
      >
        <Grid
          id="sourcecode-panel"
          item
          md={12}
          style={{ height: '600px' }}
        >
          <SourceCodePanel hasContract={activeBlock.isContract} />
        </Grid>
        <Grid
          id="memory-panel"
          item
          md={6}
          style={{ height: '600px' }}
        >
          <MemoryPanel />
        </Grid>
        <Grid
          id="stack-panel"
          item
          md={6}
          style={{ height: '600px' }}
        >
          <StackPanel />
        </Grid>
      </Grid>
    </Grid>
  )
}
