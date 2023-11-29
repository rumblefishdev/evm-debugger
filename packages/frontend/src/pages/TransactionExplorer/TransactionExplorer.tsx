/* eslint-disable unicorn/prevent-abbreviations */
import type { Layout } from 'react-grid-layout'
import ReactGridlayout, { WidthProvider } from 'react-grid-layout'
import React from 'react'
import { Box } from '@mui/material'
import { useSelector } from 'react-redux'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { TraceLogsList } from '../../components/TraceLogsList'

import { BytecodePanel, InformationPanel, SourceCodePanel, StructlogPanel } from './Panels'
import { NotAContractHero } from './TransactionExplorer.styles'
import { LayoutKeys, readLayoutFromLocalStorage, saveLayoutToLocalStorage } from './TransactionExplorer.utils'

export const TransactionExplorer: React.FC = () => {
  const GridLayout = React.useMemo(() => WidthProvider(ReactGridlayout), [])

  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const initialLayout = React.useMemo(() => {
    const BytecodeLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.BytecodeLayout)
    const BytecodeLayout: Layout = BytecodeLayoutFromLocalStorage || {
      y: 10,
      x: 4,
      w: 4,
      i: LayoutKeys.BytecodeLayout,
      h: 20,
    }

    const SourceCodeLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.SourceCodeLayout)
    const SourceCodeLayout: Layout = SourceCodeLayoutFromLocalStorage || {
      y: 0,
      x: 8,
      w: 16,
      i: LayoutKeys.SourceCodeLayout,
      h: 16,
    }

    const StructlogLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.StructlogLayout)
    const StructlogLayout: Layout = StructlogLayoutFromLocalStorage || {
      y: 10,
      x: 0,
      w: 4,
      i: LayoutKeys.StructlogLayout,
      h: 20,
    }

    const TraceLogListLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.TracelogListLayout)
    const TraceLogListLayout: Layout = TraceLogListLayoutFromLocalStorage || {
      y: 0,
      x: 0,
      w: 8,
      i: LayoutKeys.TracelogListLayout,
      h: 10,
    }

    const InformationPanelFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.InformationPanelLayout)
    const InformationPanelLayout: Layout = InformationPanelFromLocalStorage || {
      y: 16,
      x: 8,
      w: 8,
      i: LayoutKeys.InformationPanelLayout,
      h: 13,
    }

    return [BytecodeLayout, SourceCodeLayout, StructlogLayout, TraceLogListLayout, InformationPanelLayout]
  }, [])

  React.useEffect(() => {
    initialLayout.forEach((layoutItem) => {
      saveLayoutToLocalStorage(layoutItem)
    })
  }, [initialLayout])

  const handleLayoutChange = React.useCallback((layout: Layout[]) => {
    layout.forEach((layoutItem) => {
      saveLayoutToLocalStorage(layoutItem)
      console.log(layoutItem)
    })
  }, [])

  if (!activeBlock.isContract) return <NotAContractHero variant="headingUnknown">Selected Block is not a contract</NotAContractHero>

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
          <SourceCodePanel inGridLayout />
        </div>
        <div key={LayoutKeys.BytecodeLayout}>
          <BytecodePanel inGridLayout />
        </div>
        <div key={LayoutKeys.StructlogLayout}>
          <StructlogPanel inGridLayout />
        </div>
        <div key={LayoutKeys.InformationPanelLayout}>
          <InformationPanel inGridLayout />
        </div>
      </GridLayout>
    </Box>
  )
}
