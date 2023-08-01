import type { StackProps } from '@mui/material'

import type { IBlogPost } from '../../contentful-ui.types'

export type TMenu = 'services' | 'resources' | 'careers' | 'products'
export interface IState {
  resources: boolean
  services: boolean
  careers: boolean
  products: boolean
}
export interface IView {
  closeAll: () => void
  blogs: IBlogPost[]
  display?: IState
  displayHandler?: (menu: TMenu) => void
  background?: string
}

export interface AnimateIconProps {
  displayMobile: boolean
  mobileDisplayHandler: () => void
}

export interface HeaderProps extends StackProps {
  blogs: IBlogPost[]
  background?: string
}
