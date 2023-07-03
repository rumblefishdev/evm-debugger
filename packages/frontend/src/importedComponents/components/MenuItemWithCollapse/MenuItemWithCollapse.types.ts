import type { IHeaderDesktopReducerState } from '../Header/DesktopHeaderReducer'
import type { SUBMENUS } from '../../utils/SubmenusUtils'

export interface MenuItemWithCollapseProps {
  onSubmenuChange: (sub: SUBMENUS | null) => void
  onSubmenuClose: (sub: SUBMENUS | null) => void
  submenu: SUBMENUS | null
  state: IHeaderDesktopReducerState
  children: React.ReactNode
}
