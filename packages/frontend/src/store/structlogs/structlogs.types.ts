import type { IStructLog } from '@evm-debuger/types'

import type { IExtendedStructLog } from '../../types'

export type TStructlogsSlice = {
  activeStructLog: IExtendedStructLog | null
  structLogs: IStructLog[]
}
