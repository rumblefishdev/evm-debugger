import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'

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
      alignItems="start"
      alignSelf="start"
    >
      <Grid
        id="trace-panel"
        item
        md={4}
        xs={12}
        height={600}
      >
        <Box height={250}>
          <TraceLogsList />
        </Box>
        <Box
          mt={2}
          height={318}
        >
          <QuickLinksPanel />
        </Box>
      </Grid>

      <Grid
        id="structlog-panel"
        item
        md={8}
        xs={12}
        height={600}
      >
        <SourceCodePanel hasContract={activeBlock.isContract} />
      </Grid>

      <Grid
        id="memory-panel"
        item
        lg={3}
        md={4}
        xs={6}
        style={{ height: '600px' }}
      >
        <StructlogPanel />
      </Grid>
      <Grid
        id="stack-panel"
        item
        lg={3}
        md={4}
        xs={6}
        style={{ height: '600px' }}
      >
        <BytecodePanel />
      </Grid>
      <Grid
        id="memory-panel"
        item
        lg={3}
        md={4}
        xs={6}
        style={{ height: '600px' }}
      >
        <MemoryPanel />
      </Grid>
      <Grid
        id="stack-panel"
        item
        lg={3}
        md={4}
        xs={6}
        style={{ height: '600px' }}
      >
        <StackPanel />
      </Grid>
    </Grid>
  )
}
