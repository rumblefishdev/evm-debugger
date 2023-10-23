import type { IExtendedStructLog } from '../../../../types'

export interface StructlogPanelComponentProps {
  structlogs: IExtendedStructLog[]
  activeStructlogIndex: number
  handleSelect: (index: number) => void
}
