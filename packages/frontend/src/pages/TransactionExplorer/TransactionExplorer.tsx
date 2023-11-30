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
      y: 0,
      x: 3,
      w: 2,
      i: LayoutKeys.BytecodeLayout,
      h: 21,
    }

    const SourceCodeLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.SourceCodeLayout)
    const SourceCodeLayout: Layout = SourceCodeLayoutFromLocalStorage || {
      y: 0,
      x: 8,
      w: 4,
      i: LayoutKeys.SourceCodeLayout,
      h: 21,
    }

    const StructlogLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.StructlogLayout)
    const StructlogLayout: Layout = StructlogLayoutFromLocalStorage || {
      y: 0,
      x: 5,
      w: 3,
      i: LayoutKeys.StructlogLayout,
      h: 21,
    }

    const TraceLogListLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.TracelogListLayout)
    const TraceLogListLayout: Layout = TraceLogListLayoutFromLocalStorage || {
      y: 0,
      x: 0,
      w: 3,
      i: LayoutKeys.TracelogListLayout,
      h: 9,
    }

    const InformationPanelFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.InformationPanelLayout)
    const InformationPanelLayout: Layout = InformationPanelFromLocalStorage || {
      y: 9,
      x: 0,
      w: 3,
      i: LayoutKeys.InformationPanelLayout,
      h: 12,
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
        cols={12}
        rowHeight={30}
        style={{ width: '100%', height: '100%' }}
        layout={initialLayout}
        onLayoutChange={handleLayoutChange}
      >
        <div key={LayoutKeys.TracelogListLayout}>
          <TraceLogsList />
        </div>
        <div key={LayoutKeys.SourceCodeLayout}>
          <SourceCodePanel />
        </div>
        <div key={LayoutKeys.BytecodeLayout}>
          <BytecodePanel />
        </div>
        <div key={LayoutKeys.StructlogLayout}>
          <StructlogPanel />
        </div>
        <div key={LayoutKeys.InformationPanelLayout}>
          <InformationPanel />
        </div>
      </GridLayout>
    </Box>
  )
}
