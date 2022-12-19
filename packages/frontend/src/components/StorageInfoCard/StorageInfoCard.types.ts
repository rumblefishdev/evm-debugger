import type { TStorage } from '@evm-debuger/types'
import type { StackProps } from '@mui/material'

export interface StorageInfoCardProps extends StackProps {
  storage: TStorage
}
