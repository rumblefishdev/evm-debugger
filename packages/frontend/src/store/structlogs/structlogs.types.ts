import type { IStructLog } from '@evm-debuger/types'
import type { EntityState } from '@reduxjs/toolkit'

import type { IExtendedStructLog } from '../../types'

export type TStructlogsData = EntityState<IStructLog>

export type TStructlogsSlice = TStructlogsData & {
  activeStructLog: IExtendedStructLog | null
}
