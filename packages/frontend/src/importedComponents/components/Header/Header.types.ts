import type { StackProps } from '@mui/material'

import type { IBlogPost } from '../../contentful-ui.types'

export type TMenu = 'services' | 'resources' | 'careers'
export interface IState {
  resources: boolean
  services: boolean
  careers: boolean
}
export interface IView {
  closeAll: () => void
  blogs: IBlogPost[]
  display?: IState
  displayHandler?: (menu: TMenu) => void
}

export interface AnimateIconProps {
  displayMobile: boolean
  mobileDisplayHandler: () => void
}

export interface HeaderProps extends StackProps {
  blogs: IBlogPost[]
}
