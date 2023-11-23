import type { Layout } from 'react-grid-layout'

export enum LayoutKeys {
  BytecodeLayout = 'bytecodePanel',
  SourceCodeLayout = 'SourceCodepanel',
  StructlogLayout = 'StructlogPanel',
  TracelogListLayout = 'TracelogListLayout',
}

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
