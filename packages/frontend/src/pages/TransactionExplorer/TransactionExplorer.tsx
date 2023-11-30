import type { Layout } from 'react-grid-layout'
import ReactGridlayout, { WidthProvider } from 'react-grid-layout'
import React from 'react'
import { Box } from '@mui/material'
import { useSelector } from 'react-redux'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { TraceLogsList } from '../../components/TraceLogsList'

import { BytecodePanel, SourceCodePanel, StructlogPanel } from './Panels'
import { LayoutKeys, saveLayoutToLocalStorage, getLayoutForPanel } from './TransactionExplorer.utils'
import { MemoryPanel } from './Panels/MemoryPanel/MemoryPanel'
import { StackPanel } from './Panels/StackPanel/StackPanel'

export const TransactionExplorer: React.FC = () => {
  const GridLayout = React.useMemo(() => WidthProvider(ReactGridlayout), [])

  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const initialLayout = React.useMemo(() => {
    const BytecodeLayout = getLayoutForPanel(LayoutKeys.ByteCodeLayout)
    const SourceCodeLayout = getLayoutForPanel(LayoutKeys.SourceCodeLayout)
    const StructlogLayout = getLayoutForPanel(LayoutKeys.StructLogListLayout)
    const TraceLogListLayout = getLayoutForPanel(LayoutKeys.TracelogListLayout)
    const MemoryLayout = getLayoutForPanel(LayoutKeys.MemoryLayout)
    const StackLayout = getLayoutForPanel(LayoutKeys.StackLayout)

    return [BytecodeLayout, SourceCodeLayout, StructlogLayout, TraceLogListLayout, MemoryLayout, StackLayout]
  }, [])

  React.useEffect(() => {
    initialLayout.forEach((layoutItem) => {
      saveLayoutToLocalStorage(layoutItem)
    })
  }, [initialLayout])

  const handleLayoutChange = React.useCallback((layouts: Layout[]) => {
    // ### Initial layout generator - uncomment this to generate initial layout ###
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const { initialLayoutGenerator } = require('./TransactionExplorer.utils')
    // initialLayoutGenerator(layouts)
    // ### End of initial layout generator ###

    layouts.forEach((layoutItem) => {
      saveLayoutToLocalStorage(layoutItem)
    })
  }, [])

  return (
    <Box
      width="100%"
      height="100%"
    >
      <GridLayout
        className="layout"
        useCSSTransforms={true}
        autoSize={true}
        cols={24}
        rowHeight={30}
        style={{ width: '100%', height: '100%' }}
        layout={initialLayout}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".grid-draggable-handle"
      >
        <div key={LayoutKeys.TracelogListLayout}>
          <TraceLogsList inGridLayout />
        </div>
        <div key={LayoutKeys.SourceCodeLayout}>
          <SourceCodePanel
            inGridLayout
            hasContract={activeBlock.isContract}
          />
        </div>
        <div key={LayoutKeys.ByteCodeLayout}>
          <BytecodePanel inGridLayout />
        </div>
        <div key={LayoutKeys.StructLogListLayout}>
          <StructlogPanel inGridLayout />
        </div>
        <div key={LayoutKeys.MemoryLayout}>
          <MemoryPanel inGridLayout />
        </div>
        <div key={LayoutKeys.StackLayout}>
          <StackPanel inGridLayout />
        </div>
      </GridLayout>
    </Box>
  )
}
