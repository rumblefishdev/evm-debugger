import type { StackProps } from '@mui/material'

export type TMenu = 'services' | 'resources' | 'careers'
export interface IState {
  resources: boolean
  services: boolean
  careers: boolean
}
export interface IView {
  closeAll: () => void
  blogs: any[]
  display?: IState
  displayHandler?: (menu: TMenu) => void
}

export interface AnimateIconProps {
  displayMobile: boolean
  mobileDisplayHandler: () => void
}

export interface HeaderProps extends StackProps {
  blogs: any[]
}
