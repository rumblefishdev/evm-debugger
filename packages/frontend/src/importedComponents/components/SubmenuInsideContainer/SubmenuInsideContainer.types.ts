import type { SUBMENUS } from '../../utils/SubmenusUtils'

export interface SubmenuInsideContainerProps {
  onUnwantedTouch: (value: boolean) => void
  onHoverStateChange: (type: string, value: boolean) => void
  submenu: SUBMENUS | null
  children: React.ReactNode
}
