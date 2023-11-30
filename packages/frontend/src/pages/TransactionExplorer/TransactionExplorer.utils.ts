import type { Layout } from 'react-grid-layout'

import InitialLayoutJson from './TransactionExployer.layout.json'

export enum LayoutKeys {
  ByteCodeLayout = 'TransactionExplorer_ByteCodeLayout',
  SourceCodeLayout = 'TransactionExplorer_SourceCodeLayout',
  StructLogListLayout = 'TransactionExplorer_StructLogListLayout',
  TracelogListLayout = 'TransactionExplorer_TracelogListLayout',
  MemoryLayout = 'TransactionExplorer_MemoryLayout',
}

export const initialLayoutData = InitialLayoutJson as Record<LayoutKeys, Layout>

export const saveLayoutToLocalStorage = (layout: Layout): void => {
  const localStorageKey = `transactionExplorerLayout-${layout.i}`
  const localStoragePayload = JSON.stringify(layout)

  localStorage.setItem(localStorageKey, localStoragePayload)
}

export const readLayoutFromLocalStorage = (layoutKey: LayoutKeys): Layout | null => {
  const localStorageKey = `transactionExplorerLayout-${layoutKey}`
  const localStoragePayload = localStorage.getItem(localStorageKey)

  if (localStoragePayload) {
    return JSON.parse(localStoragePayload)
  }

  return null
}

export const initialLayoutGenerator = (layouts: Layout[]) => {
  // Should be used to generate the initial layout json to be pasted into the layout json file
  // Only used for development purposes
  const layoutObj = layouts.reduce((accumulator, layout) => {
    return {
      ...accumulator,
      [layout.i]: layout,
    }
  }, {})

  console.log(JSON.stringify(layoutObj, null, 2))
}

export const getLayoutForPanel = (layoutKey: LayoutKeys): Layout => {
  const localStorageLayout = readLayoutFromLocalStorage(layoutKey)
  return (
    localStorageLayout ||
    ({
      ...initialLayoutData[layoutKey],
      // eslint-disable-next-line unicorn/prevent-abbreviations
      i: layoutKey,
    } as Layout)
  )
}
