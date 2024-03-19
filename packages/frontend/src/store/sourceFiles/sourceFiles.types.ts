import type { TContractSourceFiles } from '@evm-debuger/types'
import type { EntityState } from '@reduxjs/toolkit'

export type TSourceFilesEntity = EntityState<TContractSourceFiles>
export type TSourceFilesState = TSourceFilesEntity & { activeSourceFileId: number }
