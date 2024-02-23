import type { TYulNodeBase } from '@evm-debuger/types'

export type TYulNodeBaseWithListIndex = TYulNodeBase & { listIndex: number }

export type TYulNodeElements = Record<string, TYulNodeBaseWithListIndex>

export type TYulNodeState = { address: string; yulNodes: TYulNodeElements }
