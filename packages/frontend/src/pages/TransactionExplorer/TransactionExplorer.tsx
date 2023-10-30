/* eslint-disable unicorn/prevent-abbreviations */
import type { Layout } from 'react-grid-layout'
import ReactGridlayout, { WidthProvider } from 'react-grid-layout'
import React from 'react'
import { Box } from '@mui/material'
import { useSelector } from 'react-redux'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'

import { BytecodePanel, SourceCodePanel, StructlogPanel } from './Panels'
import { NotAContractHero } from './TransactionExplorer.styles'

enum LayoutKeys {
  BytecodeLayout = 'bytecodePanel',
  SourceCodeLayout = 'SourceCodepanel',
  StructlogLayout = 'StructlogPanel',
}

const saveLayoutToLocalStorage = (layout: Layout): void => {
  const localStorageKey = `transactionExplorerLayout-${layout.i}`
  const localStoragePayload = JSON.stringify(layout)

  localStorage.setItem(localStorageKey, localStoragePayload)
}

const readLayoutFromLocalStorage = (layoutKey: LayoutKeys): Layout | null => {
  const localStorageKey = `transactionExplorerLayout-${layoutKey}`

  const localStoragePayload = localStorage.getItem(localStorageKey)

  if (localStoragePayload) {
    return JSON.parse(localStoragePayload)
  }

  return null
}

export const TransactionExplorer: React.FC = () => {
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const initialLayout = React.useMemo(() => {
    const BytecodeLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.BytecodeLayout)
    const BytecodeLayout: Layout = BytecodeLayoutFromLocalStorage || { y: 0, x: 3, w: 3, i: LayoutKeys.BytecodeLayout, h: 20 }

    const SourceCodeLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.SourceCodeLayout)
    const SourceCodeLayout: Layout = SourceCodeLayoutFromLocalStorage || { y: 0, x: 6, w: 6, i: LayoutKeys.SourceCodeLayout, h: 20 }

    const StructlogLayoutFromLocalStorage = readLayoutFromLocalStorage(LayoutKeys.StructlogLayout)
    const StructlogLayout: Layout = StructlogLayoutFromLocalStorage || { y: 0, x: 0, w: 3, i: LayoutKeys.StructlogLayout, h: 20 }

    return [BytecodeLayout, SourceCodeLayout, StructlogLayout]
  }, [])

  React.useEffect(() => {
    initialLayout.forEach((layoutItem) => {
      saveLayoutToLocalStorage(layoutItem)
    })
  }, [initialLayout])

  const GridLayout = React.useMemo(() => WidthProvider(ReactGridlayout), [])

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
        onLayoutChange={(layout) => {
          layout.forEach((layoutItem) => {
            saveLayoutToLocalStorage(layoutItem)
          })
        }}
      >
        <div key={LayoutKeys.SourceCodeLayout}>
          <SourceCodePanel />
        </div>
        <div key={LayoutKeys.BytecodeLayout}>
          <BytecodePanel />
        </div>
        <div key={LayoutKeys.StructlogLayout}>
          <StructlogPanel />
        </div>
      </GridLayout>
    </Box>
  )
}
