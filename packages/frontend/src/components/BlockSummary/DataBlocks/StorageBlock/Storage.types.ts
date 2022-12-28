import type { TStorageLogs } from '@evm-debuger/types'

export interface StorageBlockProps {
  storageAddress: string
  storageLogs: TStorageLogs
}
