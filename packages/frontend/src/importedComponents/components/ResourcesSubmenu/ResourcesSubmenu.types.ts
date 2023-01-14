import type { StackProps } from '@mui/material'
import { IBlogPost } from '../../contentful-ui.types'

export interface ResourcesSubmenuProps extends StackProps {
  blogs: IBlogPost[]
}

export interface BlogSectionProps extends StackProps {
  blogs: IBlogPost[]
}
